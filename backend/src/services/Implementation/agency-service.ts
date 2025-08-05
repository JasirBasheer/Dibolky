import { IAgencyType, IAgencyTenant } from "../../types/agency";
import bcrypt from "bcryptjs";
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import {
  ConflictError,
  CustomError,
  generatePassword,
  hashPassword,
  NotFoundError,
  sendMail,
  UnauthorizedError,
} from "mern.common";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IProjectRepository } from "../../repositories/Interface/IProjectRepository";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import {
  IClientTenantType,
  IClientTenantWithProjectDetailsType,
  IClientType,
} from "../../types/client";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import {
  IFiles,
  IIntegratePaymentType,
  IPlatforms,
  IBucket,
} from "../../types/common";
import { IAvailableClients, ServicesData } from "../../types/chat";
import { IProject } from "../../models/Implementation/project";
import { createClientMailData } from "../../utils/mail.datas";
import { AgencyMapper } from "@/mappers/agency/agency-mapper";
import { IAgency } from "@/models/Interface/agency";
import { IClientTenant } from "@/models";
import { createNewMenuForClient } from "@/utils/menu.utils";
import {
  IActivityRepository,
  InoviceRepository,
  IPlanRepository,
  ITransactionRepository,
  ITransactionTenantRepository,
  TransactionRepository,
  TransactionTenantRepository,
} from "@/repositories";
import { IInvoiceType } from "@/types/invoice";
import { IPlan } from "@/models/Interface/plan";
import { addMonthsToDate } from "@/utils/date-utils";
import { FilterType } from "@/utils";
import { sendGMail } from "@/providers/google";

@injectable()
export class AgencyService implements IAgencyService {
  private _agencyRepository: IAgencyRepository;
  private _agencyTenantRepository: IAgencyTenantRepository;
  private _clientRepository: IClientRepository;
  private _clientTenantRepository: IClientTenantRepository;
  private _projectRepository: IProjectRepository;
  private _contentRepository: IContentRepository;
  private _invoiceRepository: InoviceRepository;
  private _planRepository: IPlanRepository;
  private _transactionRepository: ITransactionRepository;
  private _transactiontenantRepository: ITransactionTenantRepository;
  private _activityRepository: IActivityRepository;

  constructor(
    @inject("AgencyRepository") agencyRepository: IAgencyRepository,
    @inject("AgencyTenantRepository")
    agencyTenantRepository: IAgencyTenantRepository,
    @inject("ClientRepository") clientRepository: IClientRepository,
    @inject("ClientTenantRepository")
    clientTenantRepository: IClientTenantRepository,
    @inject("ProjectRepository") projectRepository: IProjectRepository,
    @inject("ContentRepository") contentRepository: IContentRepository,
    @inject("InvoiceRepository") invoiceRepository: InoviceRepository,
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("TransactionRepository")
    transactionRepository: ITransactionRepository,
    @inject("TransactionTenantRepository")
    transactiontenantRepository: ITransactionTenantRepository,
    @inject("ActivityRepository") activityRepository: IActivityRepository
  ) {
    (this._agencyRepository = agencyRepository),
      (this._agencyTenantRepository = agencyTenantRepository);
    (this._clientRepository = clientRepository),
      (this._clientTenantRepository = clientTenantRepository),
      (this._projectRepository = projectRepository);
    this._contentRepository = contentRepository;
    this._invoiceRepository = invoiceRepository;
    this._planRepository = planRepository;
    this._transactionRepository = transactionRepository;
    this._transactiontenantRepository = transactiontenantRepository;
    this._activityRepository = activityRepository;
  }

  async agencyLoginHandler(email: string, password: string): Promise<string> {
    try {
      const ownerDetails = await this._agencyRepository.findAgencyWithMail(
        email
      );
      if (!ownerDetails) throw new NotFoundError("User not found");
      if (ownerDetails.isBlocked)
        throw new UnauthorizedError("Account is blocked");

      const isValid = await bcrypt.compare(password, ownerDetails.password!);
      if (!isValid) throw new UnauthorizedError("Invalid credentials");
      return ownerDetails?._id as string;
    } catch (error) {
      throw error;
    }
  }

  async getProjects(
    orgId: string,
    projectsFor: string = "dasboard"
  ): Promise<object> {
    const data = await this._projectRepository.fetchAllProjects(orgId);
    if (projectsFor == "dasboard") {
      const weaklyProjects =
        data.projects?.filter(
          (project: IProject) =>
            new Date(project.createdAt!).getTime() >
            new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        ) || [];
      return {
        count: data?.projects.length || 0,
        lastWeekCount: weaklyProjects?.length || 0,
      };
    }
    return data.projects;
  }

  

  async getAllAvailableClients(orgId: string): Promise<IAvailableClients[]> {
    const clients = await this._clientTenantRepository.getAllClients(orgId);
    return (
      clients.data.map((client: IClientTenant) => {
        return {
          _id: client._id as string,
          name: client.name ?? "user",
          email: client.email ?? "user@gmail.com",
          profile: client.profile,
          type: "client",
        };
      }) ?? []
    );
  }

  async verifyOwner(agency_id: string): Promise<Partial<IAgencyType> | null> {
    const AgencyDetails = await this._agencyRepository.findAgencyWithId(
      agency_id
    );
    return AgencyMapper.AgenyDetailsMapper(AgencyDetails as IAgency);
  }

  async getAgencyOwnerDetails(orgId: string): Promise<IAgencyTenant | null> {
    let AgencyOwners = await this._agencyTenantRepository.getOwners(orgId);
    if (!AgencyOwners)
      throw new NotFoundError("Agency not found , Please try again");
    return AgencyOwners[0];
  }

  async createClient(
    orgId: string,
    name: string,
    email: string,
    industry: string,
    services: ServicesData,
    menu: string[],
    organizationName: string
  ): Promise<IClientTenant | null> {
    const client = await this._clientRepository.findClientWithMail(email);
    const agencyOwner = await this._agencyTenantRepository.getOwnerWithOrgId(
      orgId
    );
    if (
      !agencyOwner.paymentCredentials.razorpay.secret_id ||
      !agencyOwner.paymentCredentials.razorpay.secret_key
    )
      throw new NotFoundError(
        "Payment gateway is not integrated for your agency, inorder to create a new client integrate payment methods in your integration setings."
      );

    if (client && client.orgId == orgId)
      throw new ConflictError("Client already exists with this email");
    const Agency = await this._agencyRepository.findAgencyWithOrgId(orgId);
    if (!Agency) throw new NotFoundError("Agency not found , Please try again");
    if (Agency.remainingClients == 0)
      throw new CustomError(
        "Client creation limit reached ,Please upgrade for more clients",
        402
      );

    let password = await generatePassword(name);
    const HashedPassword = await hashPassword(password);

    const clientDetails = {
      orgId: orgId,
      name: name,
      email: email,
      industry: industry,
      password: HashedPassword,
    };
    let newMenu = createNewMenuForClient(menu);

    const mainDbCreatedClient = await this._clientRepository.createClient(
      clientDetails as IClientType
    );
    if (!mainDbCreatedClient)
      throw new CustomError(
        "An unexpected error occured while creating client,Please try again later.",
        500
      );
    const createdClient: IClientTenant =
      await this._clientTenantRepository.createClient(orgId, {
        ...clientDetails,
        menu: newMenu,
        main_id: String(mainDbCreatedClient._id),
      });

    for (let item in services) {
      const { serviceName, serviceDetails } = services[item];
      const { deadline, ...details } = serviceDetails;
      await this._projectRepository.createProject(
        createdClient.orgId as string,
        createdClient._id as string,
        createdClient.name as string,
        serviceName as string,
        details,
        item,
        new Date(deadline)
      );

      const invoice = {
        invoiceNumber: `dibolky-${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}`,
        agencyId: agencyOwner._id,
        client: {
          clientId: createdClient._id,
          clientName: createdClient.name,
          email: createdClient.email,
        },
        service: { serviceName, details },
        pricing: Number(details.budget),
        dueDate: new Date(deadline),
        orgId,
        orgName: agencyOwner.organizationName,
      };
      console.log(invoice, " invoiceeeee");

      await this._invoiceRepository.createInvoice(orgId, invoice);
    }


    const activity = {
      user: {
        userId: createdClient._id.toString(),
        username: createdClient.name,
        email: createdClient.email,
      },
      activityType: "account_created",
      activity: `new client ${clientDetails.name} has been created with ${menu.length} services`,
      entity: {
        type: "agency",
        id: Agency._id.toString()
      },
      redirectUrl: "clients",
    };

    await this._activityRepository.createActivity(orgId, activity);


    const data = createClientMailData(
      email,
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      organizationName,
      password
    );
    sendMail(
      email,
      `Welcome to ${Agency.organizationName}! Excited to Partner with You`,
      data,
      (error: unknown, info: { response: string }) => {
        if (error) {
          console.error("Failed to send email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      }
    );
    return createdClient;
  }

  private _buildDbFilter(query: FilterType): Record<string, unknown> {
    const { query: searchText } = query;
    const filter: Record<string, unknown> = {};

    if (searchText) {
      filter.$or = [
        { name: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
        { industry: { $regex: searchText, $options: "i" } },
      ];
    }
    return filter;
  }

  async getAllClients(
    orgId: string,
    includeDetails: string,
    query: FilterType
  ): Promise<{
    clients:
      | IClientTenantType[]
      | IClientTenantWithProjectDetailsType[]
      | { count: number; lastWeekCount: number };
    totalPages?: number;
    currentPage?: number;
    totalCount?: number;
  }> {
    const clientsFilter = this._buildDbFilter(query);
    const { page, limit, sortBy, sortOrder } = query;
    const options = {
      page,
      limit,
      sort: sortBy ? { [sortBy]: sortOrder === "desc" ? -1 : 1 } : {},
    };

    const result = await this._clientTenantRepository.getAllClients(
      orgId,
      clientsFilter,
      options
    );
    const totalPages = limit ? Math.ceil(result.totalCount / limit) : 1;
    let clients = AgencyMapper.TenantClientMapper(result.data);

    switch (includeDetails) {
      case "details":
        const clientsWithProjectDetails = await Promise.all(
          clients.map(async (client) => {
            const projects =
              await this._projectRepository.getProjectsByClientId(
                orgId,
                client._id
              );
            return { ...client, projects };
          })
        );
        clients = clientsWithProjectDetails;
        break;
        
      case "count":
        const lastWeekClients =
          clients?.filter(
            (client) =>
              new Date(client.createdAt!).getTime() >
              new Date().getTime() - 7 * 24 * 60 * 60 * 1000
          ) || [];
        return {
          clients: {
            count: clients?.length || 0,
            lastWeekCount: lastWeekClients?.length || 0,
          }
        };

      default:
        break;
    }

    return {
      clients,
      totalCount: result.totalCount,
      totalPages,
      currentPage: page,
    };
  }
  

  async getClient(
    orgId: string,
    client_id: string
  ): Promise<IClientTenant | null> {
    return await this._clientTenantRepository.getClientById(orgId, client_id);
  }

  async saveContentToDb(
    client_id: string,
    orgId: string,
    files: IFiles[],
    platforms: IPlatforms[],
    contentType: string,
    caption: string
  ): Promise<IBucket | null> {
    const details = {
      files,
      platforms,
      contentType,
      client_id,
      orgId,
      caption,
    };
    return await this._contentRepository.saveContent(details);
  }

  async getContent(orgId: string, contentId: string): Promise<IBucket | null> {
    return await this._contentRepository.getContentById(orgId, contentId);
  }

  async changeContentStatus(
    orgId: string,
    contentId: string,
    status: string
  ): Promise<IBucket | null> {
    return await this._contentRepository.changeContentStatus(
      orgId,
      contentId,
      status
    );
  }

  async editProjectStatus(
    orgId: string,
    projectId: string,
    status: string
  ): Promise<IProject | null> {
    return await this._projectRepository.editProjectStatus(
      orgId,
      projectId,
      status
    );
  }

  async getInitialSetUp(orgId: string): Promise<object> {
    const owners = await this._agencyTenantRepository.getOwners(orgId);

    return {
      isSocialMediaInitialized: owners?.[0]?.isSocialMediaInitialized,
      isPaymentInitialized: owners?.[0]?.isPaymentInitialized,
    };
  }

  async integratePaymentGateWay(
    orgId: string,
    provider: string,
    details: IIntegratePaymentType
  ): Promise<IAgencyTenant> {
    const integratedDetails =
      await this._agencyTenantRepository.integratePaymentGateWay(
        orgId,
        provider,
        details
      );
    if (!integratedDetails)
      throw new CustomError(
        "An unexpected error occured while integration paymentgatway",
        500
      );
    return integratedDetails;
  }

  async getPaymentIntegrationStatus(
    orgId: string
  ): Promise<Record<string, boolean>> {
    const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    if (!owner)
      throw new CustomError(
        "An unexpected error occured while fetching owner details, please try again later",
        500
      );
    return {
      isRazorpayIntegrated: !!owner.paymentCredentials?.razorpay?.secret_id,
      isStripeIntegrated: !!owner.paymentCredentials?.stripe?.secret_key,
    };
  }

  async createInvoice(
    orgId: string,
    details: Partial<IInvoiceType>
  ): Promise<void> {
    const agency = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    const invoice = {
      invoiceNumber: `dibolky-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`,
      agencyId: agency._id,
      orgName: agency.organizationName,
      ...details,
    };
    await this._invoiceRepository.createInvoice(orgId, invoice);
  }

  async getUpgradablePlans(
    orgId: string
  ): Promise<(IPlan & { proratedPrice: number })[]> {
    const agency = await this._agencyRepository.findAgencyWithOrgId(orgId);
    const currentPlan = await this._planRepository.getPlan(agency.planId);

    if (!currentPlan || currentPlan.price === 0) return [];

    const allPlans = await this._planRepository.getPlans();
    console.log(agency)

    const upgradablePlans = allPlans
      .filter(
        (plan) =>
          plan.isActive &&
          plan.price > currentPlan.price &&
          plan._id.toString() !== currentPlan._id.toString()
      )
      .map((plan) => {
        const proratedPrice = this.calculateProratedPrice(
          plan.price,
          agency.createdAt,
          plan.billingCycle
        );
        return { ...plan.toObject(), proratedPrice };
      });
    console.log(upgradablePlans)

    return upgradablePlans;
  }

  private calculateProratedPrice(
    fullPrice: number,
    planStartDate: Date,
    billingClycle: string
  ): number {
    const now = new Date();
    const usedDays = Math.floor(
      (now.getTime() - new Date(planStartDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const billingCycleDays = billingClycle == "monthly" ? 30 : 365;
    const remainingDays = Math.max(0, billingCycleDays - usedDays);

    const pricePerDay = fullPrice / billingCycleDays;
    const discount = pricePerDay * remainingDays;

    return parseFloat((fullPrice - discount).toFixed(2));
  }

  async upgradePlan(orgId: string, planId: string): Promise<void> {
    const plan = await this._planRepository.getPlan(planId);
    if (!plan || !plan.isActive) {
      throw new CustomError("Selected plan is not available", 400);
    }

    const agency = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    console.log(agency,'agency')
    if (!agency) {
      throw new CustomError("Agency not found", 404);
    }

    const proratedPrice = this.calculateProratedPrice(
      plan.price,
      agency.createdAt,
      plan.billingCycle
    );

    const validityInDate = addMonthsToDate(
      plan.billingCycle == "monthly" ? 30 : 365
    );
    await this._agencyRepository.upgradePlanWithOrgId(
      orgId,
      plan._id as string,
      validityInDate
    );
    await this._agencyTenantRepository.upgradePlan(orgId, plan._id as string);

    const transaction = {
      orgId,
      email: agency.email,
      userId: agency._id,
      planId: plan._id,
      paymentGateway: "razorpay",
      transactionId: `upgrade-${Date.now()}`,
      amount: proratedPrice,
      description: `Upgraded to ${plan.name} plan`,
      currency: "USD",
      transactionType: "plan_transactions",
    };

    await this._transactionRepository.createTransaction(transaction);
    await this._transactiontenantRepository.createTransaction(
      orgId,
      transaction
    );

    const activity = {
      user: {
        userId: agency._id.toString(),
        username: agency.organizationName,
        email: agency.email,
      },
      activityType: "plan_upgraded",
      activity: `Agency upgraded to ${plan.name} plan`,
      entity: {
        type: "agency",
        id: agency._id.toString()
      },
      redirectUrl: "settings",
    };

    await this._activityRepository.createActivity(orgId, activity);
  }

  async sendMail(
    orgId: string,
    to: string[],
    subject: string,
    message: string
  ): Promise<void> {
    const agency = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    const { accessToken, refreshToken } = agency?.social_credentials?.gmail;
    await sendGMail(
      accessToken,
      refreshToken,
      agency.email,
      to,
      subject,
      message
    );
  }
}
