import { inject, injectable } from "tsyringe";
import {
  ConflictError,
  CustomError,
  NotFoundError,
  UnauthorizedError,
  comparePassword,
  generatePassword,
  hashPassword,
} from "mern.common";
import { IClientTenantType, IClientTenantWithProjectDetailsType, IClientType } from "../../types/client";
import { IAgencyTenant } from "../../types/agency";
import { IClient } from "@/models/Interface/client";
import { ClientMapper } from "@/mappers/client/client-mapper";
import { IClientTenant } from "@/models";
import { IRazorpayOrder } from "@/types/payment";
import {
  IActivityRepository,
  IAgencyRepository,
  IAgencyTenantRepository,
  IClientRepository,
  IClientTenantRepository,
  IInvoiceRepository,
  IProjectRepository,
  ITransactionTenantRepository,
} from "@/repositories";
import { IClientService, IPaymentService } from "../Interface";
import crypto from "node:crypto";
import { decryptToken, FilterType, sendMail } from "@/utils";
import { ServicesData } from "@/types/chat";
import { createNewMenuForClient } from "@/utils/menu.utils";
import { createClientMailData } from "@/utils/mail.datas";
import { AgencyMapper } from "@/dtos";

@injectable()
export class ClientService implements IClientService {


  constructor(
    @inject("AgencyTenantRepository")private readonly _agencyTenantRepository: IAgencyTenantRepository,
    @inject("ClientRepository")private readonly _clientRepository: IClientRepository,
    @inject("ClientTenantRepository")private readonly _clientTenantRepository: IClientTenantRepository,
    @inject("InvoiceRepository")private readonly _invoiceRepository: IInvoiceRepository,
    @inject("PaymentService")private readonly _paymentService: IPaymentService,
    @inject("TransactionTenantRepository")private readonly _transactionTenantRepository: ITransactionTenantRepository,
    @inject("ActivityRepository")private readonly _activityRepository: IActivityRepository,
    @inject("AgencyRepository")private readonly _agencyRepository: IAgencyRepository,
    @inject("ProjectRepository")private readonly _projectRepository: IProjectRepository,
    ) {}

  async clientLoginHandler(email: string, password: string): Promise<string> {
    const clientDetails = await this._clientRepository.findClientWithMail(
      email
    );
    if (!clientDetails) throw new NotFoundError("Account not found");
    if (clientDetails?.isBlocked)
      throw new UnauthorizedError("Account is blocked");

    const isValid = await comparePassword(password, clientDetails.password);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");

    return clientDetails._id as string;
  }

  async verifyClient(client_id: string): Promise<Partial<IClientType> | null> {
    const client = await this._clientRepository.findClientWithId(client_id);
    return ClientMapper.ClientDetailsMapper(client as IClient);
  }

  async getClientDetails(
    orgId: string,
    email: string
  ): Promise<IClientTenant | null> {
    return await this._clientTenantRepository.getClientDetailsByMail(
      orgId,
      email
    );
  }

  async getClientTenantDetailsById(
    orgId: string,
    client_id: string
  ): Promise<IClientTenant | null> {
    console.log(orgId, client_id, "org and client id");
    return await this._clientTenantRepository.getClientById(orgId, client_id);
  }

  async getOwners(orgId: string): Promise<IAgencyTenant[] | null> {
    return await this._agencyTenantRepository.getOwners(orgId);
  }

  async getClientInMainDb(email: string): Promise<IClient | null> {
    const client = await this._clientRepository.findClientWithMail(email);
    return client;
  }

  async initiateRazorpayPayment(
    orgId: string,
    invoice_id: string
  ): Promise<IRazorpayOrder | null> {
    const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    const invoice = await this._invoiceRepository.getInvoiceById(
      orgId,
      invoice_id
    );
    const paymentCredentials = owner.paymentCredentials.razorpay;
    return await this._paymentService.razorpay(
      { amount: invoice.pricing, currency: "USD" },
      decryptToken(paymentCredentials.secret_id),
      decryptToken(paymentCredentials.secret_key)
    );
  }

  async verifyInvoicePayment(
    orgId: string,
    invoice_id: string,
    response: IRazorpayOrder
  ): Promise<void> {
    const invoice = await this._invoiceRepository.getInvoiceById(
      orgId,
      invoice_id
    );
    if (!invoice) throw new NotFoundError("invoice not found.");
    const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId);
    const paymentCredentials = owner.paymentCredentials.razorpay;

    const generatedSignature = crypto
      .createHmac("sha256", decryptToken(paymentCredentials.secret_key))
      .update(`${response.razorpay_order_id}|${response.razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== response.razorpay_signature)
      throw new CustomError("Invalid payment signature", 400);

    await this._invoiceRepository.updateInvoiceStatus(orgId, invoice_id);
    const transaction = {
      orgId,
      userId: invoice.client.clientId,
      email: invoice.client.email,
      transactionId: response.razorpay_order_id,
      amount: invoice.pricing,
      description: `Invoice ${invoice.invoiceNumber} from ${invoice.client.clientName} has been paid`,
      currency: "USD",
      transactionType: "invoice_payment",
    };
    await this._transactionTenantRepository.createTransaction(
      orgId,
      transaction
    );
    const activity = {
      user: {
        userId: invoice.client.clientId,
        username: invoice.client.clientName,
        email: invoice.client.email,
      },
      activityType: "invoice_payment",
      activity: `Invoice ${invoice.invoiceNumber} from ${invoice.client.clientName} has been paid`,
      redirectUrl: "invoices/payments",
      entity: {
        type: "client",
        id: owner._id.toString(),
      },
    };
    await this._activityRepository.createActivity(orgId, activity);
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
    const agency = await this._agencyRepository.findAgencyWithOrgId(orgId);
    if (!agency) throw new NotFoundError("Agency not found , Please try again");
    if (agency.remainingClients == 0)
      throw new CustomError(
        "Client creation limit reached ,Please upgrade for more clients",
        402
      );
    if (Object.keys(services).length > agency.remainingProjects)
      throw new CustomError(
        "Project creation limit reached ,Please upgrade for more Projects",
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

      await this._invoiceRepository.createInvoice(orgId, invoice);
      await this._agencyRepository.decreaseClientCount(orgId);
      await this._agencyRepository.decreaseProjectCount(orgId);
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
        id: agency._id.toString(),
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
      `Welcome to ${agency.organizationName}! Excited to Partner with You`,
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
            },
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
}
