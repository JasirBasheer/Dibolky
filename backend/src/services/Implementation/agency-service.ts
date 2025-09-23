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
import { IClientTenant, Plan, PlanDoc } from "@/models";
import {
  IActivityRepository,
  InoviceRepository,
  IPlanRepository,
  ITransactionRepository,
  ITransactionTenantRepository,
} from "@/repositories";
import { IInvoiceType } from "@/types/invoice";
import { addMonthsToDate } from "@/utils/date-utils";
import { decryptToken, FilterType, QueryParser } from "@/utils";
import { sendGMail } from "@/providers/google";
import mongoose from "mongoose";
import { AdminAgencyMapper } from "@/mappers/admin/agency-mapper";
import { IAgencyRegistrationDto } from "@/dtos/agency";
import { AgencyMapper, PaginatedResponse, QueryDto } from "@/dtos";

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
  private _transactionTenantRepository: ITransactionTenantRepository;
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
    this._transactionTenantRepository = transactiontenantRepository;
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

  async getAllAgencies(
    query: QueryDto
  ): Promise<PaginatedResponse<IAgencyType>> {
    const result = await this._agencyRepository.getAllAgencies(query);
    return { 
      ...result,
      data : result.data.map(agency => AgencyMapper.toAgencyResponse(agency))
    };
  }

  async getAgencyById(agencyId: string): Promise<IAgencyType | null> {
    const details = await this._agencyRepository.findAgencyWithId(agencyId);
    if (!details) throw new NotFoundError("Agency Not Found");
    return details;
  }

  async createAgency(
    payload: IAgencyRegistrationDto
  ): Promise<Partial<IAgencyType> | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        organizationName,
        name,
        email,
        address,
        websiteUrl,
        industry,
        contactNumber,
        logo,
        password,
        planId,
        validity,
        planPurchasedRate,
        transactionId,
        paymentGateway,
        description,
        currency,
      } = payload;

      const plan = await this._planRepository.getPlan(planId);
      if (!plan) throw new Error("Plan not found");
      if (payload.paymentGateway == "trial") {
        console.log(plan.type)
        if (plan.type !== payload.paymentGateway) {
          throw new CustomError(
            "Invalid payment gateway for the selected plan.",
            400
          );
        }
      }

      const hashedPassword = await hashPassword(password);
      const orgId =
        organizationName.replace(/[\s\W]+/g, "") +
        Math.floor(Math.random() * 1000000);
      const validityInDate = addMonthsToDate(plan.billingCycle, validity);

      const newAgency = {
        orgId,
        planId,
        validity: validityInDate,
        organizationName,
        name,
        email,
        address,
        websiteUrl,
        industry,
        contactNumber,
        logo,
        password: hashedPassword,
        remainingClients: plan.maxClients,
        remainingProjects: plan.maxProjects,
        planPurchasedRate,
        currency,
      };

      const ownerDetails = await this._agencyRepository.createAgency(
        newAgency,
        session
      );

      if (!ownerDetails) throw new Error("Failed to create agency");
      await session.commitTransaction();

      const newTenantAgency = {
        main_id: ownerDetails?._id,
        orgId,
        planId,
        organizationName,
        name,
        email,
        permissions: plan.permissions,
      };

      const newTransaction = {
        orgId,
        email,
        userId: ownerDetails?._id,
        planId,
        paymentGateway,
        transactionId,
        amount: planPurchasedRate,
        description,
        currency,
        transactionType: "plan_transactions",
      };

      const activity = {
        user: {
          userId: ownerDetails._id as string,
          username: organizationName,
          email,
        },
        activityType: "account_created",
        activity: "Account created for agency",
        entity: {
          type: "agency",
          id: ownerDetails._id.toString(),
        },
        redirectUrl: "settings",
      };
      await this._agencyTenantRepository.saveDetails(
        newTenantAgency,
        orgId as string
      );
      if(plan.type == "trial"){
        await this._transactionRepository.createTransaction(newTransaction);
        await this._transactionTenantRepository.createTransaction(
          orgId,
          newTransaction
        );
      }
        
      await this._activityRepository.createActivity(orgId, activity);
      return ownerDetails;
    } catch (error) {
      await session.abortTransaction().catch(() => {});
      await session.endSession();
      console.error(" createAgency failed:", error);
      if (error.code === 11000) {
        throw new ConflictError("Account with this email already exists...");
      }
    } finally {
      if (!session.hasEnded) {
        await session.endSession();
      }
    }
  }

  async IsMailExists(mail: string): Promise<boolean> {
    const isExists = await this._agencyRepository.findAgencyWithMail(mail);
    if (isExists) return true;
    return false;
  }

  async toggleAccess(client_id: string): Promise<void> {
    if (!client_id)
      throw new NotFoundError("client Id not found please try again");
    await this._agencyRepository.toggleAccess(client_id);
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
    return AgencyMapper.AgenyDetailsMapper(AgencyDetails);
  }

  async getOwner(orgId: string): Promise<IAgencyTenant[]> {
    return await this._agencyTenantRepository.getOwners(orgId);
  }

  async getAgencyOwnerDetails(orgId: string): Promise<IAgencyTenant | null> {
    let AgencyOwners = await this._agencyTenantRepository.getOwners(orgId);
    if (!AgencyOwners)
      throw new NotFoundError("Agency not found , Please try again");
    return AgencyOwners[0];
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
  ): Promise<(Plan & { proratedPrice: number })[]> {
    const agency = await this._agencyRepository.findAgencyWithOrgId(orgId);
    const currentPlan = await this._planRepository.getPlan(agency.planId);

    if (!currentPlan) return [];

    const allPlans = await this._planRepository.getPlans({page: 0,limit: 0});

    const upgradablePlans = allPlans.data
      .filter(
        (plan) =>
          plan.isActive &&
          plan.type !== "trial" &&
          plan.price > currentPlan.price &&
          plan._id.toString() !== currentPlan._id.toString()
      )
      .map((plan) => {
        let proratedPrice = plan.price;

        if (currentPlan.type !== "trial") {
          proratedPrice = this.calculateProratedPrice(
            plan.price,
            agency.createdAt,
            plan.billingCycle
          );
        }

        return { ...plan.toObject(),
          id: plan.toObject()._id.toString(),
           proratedPrice };
      });

    return upgradablePlans;
  }

  private calculateProratedPrice(
    fullPrice: number,
    planStartDate: Date,
    billingCycle: "monthly" | "yearly"
  ): number {
    const now = new Date();
    const usedDays = Math.floor(
      (now.getTime() - new Date(planStartDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const billingCycleDays = billingCycle === "monthly" ? 30 : 365;
    const remainingDays = Math.max(0, billingCycleDays - usedDays);

    const pricePerDay = fullPrice / billingCycleDays;
    const proratedPrice = pricePerDay * remainingDays;

    return parseFloat(proratedPrice.toFixed(2));
  }

  async upgradePlan(orgId: string, planId: string): Promise<void> {
    const plan = await this._planRepository.getPlan(planId);
    if (!plan || !plan.isActive) {
      throw new CustomError("Selected plan is not available", 400);
    }

    const agency = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    console.log(agency, "agency");
    if (!agency) {
      throw new CustomError("Agency not found", 404);
    }

    const proratedPrice = this.calculateProratedPrice(
      plan.price,
      agency.createdAt,
      plan.billingCycle
    );

    const validityInDate = addMonthsToDate(
      plan.billingCycle,
      plan.billingCycle == "monthly" ? 30 : 365
    );
    await this._agencyRepository.upgradePlanWithOrgId(
      orgId,
      plan.id as string,
      validityInDate
    );
    await this._agencyTenantRepository.upgradePlan(orgId, plan.id as string);

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
    await this._transactionTenantRepository.createTransaction(
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
        id: agency._id.toString(),
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
    if(!accessToken || !refreshToken)throw new NotFoundError("Please intergrate google mail in order to send your mails to the client..")

    await sendGMail(
      decryptToken(accessToken),
      decryptToken(refreshToken),
      agency.email,
      to,
      subject,
      message
    );
  }
}
