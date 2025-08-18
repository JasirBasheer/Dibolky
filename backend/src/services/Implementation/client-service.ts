import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IClientService } from "../Interface/IClientService";
import { CustomError, NotFoundError, UnauthorizedError, comparePassword } from "mern.common";
import { IClientType } from "../../types/client";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IAgencyTenant } from "../../types/agency";
import { IClient } from "@/models/Interface/client";
import { ClientMapper } from "@/mappers/client/client-mapper";
import { IClientTenant } from "@/models";
import { IRazorpayOrder } from "@/types/payment";
import { IActivityRepository, IInvoiceRepository, ITransactionTenantRepository } from "@/repositories";
import { IPaymentService } from "../Interface";
import crypto from "node:crypto"
import { decryptToken } from "@/utils";

@injectable()
export class ClientService implements IClientService {
  private _clientRepository: IClientRepository;
  private _clientTenantRepository: IClientTenantRepository
  private _contentRepository: IContentRepository
  private _agencyTenantRepository: IAgencyTenantRepository
  private _invoiceRepository: IInvoiceRepository
  private _transactionTenantRepository: ITransactionTenantRepository
  private _paymentService: IPaymentService
  private _activityRepository: IActivityRepository

  constructor(
    @inject('ClientRepository') clientRepository: IClientRepository,
    @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
    @inject('ContentRepository') contentRepository: IContentRepository,
    @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
    @inject('InvoiceRepository') invoiceRepository: IInvoiceRepository,
    @inject('PaymentService') paymentService: IPaymentService,
    @inject('TransactionTenantRepository') transactionTenantRepository: ITransactionTenantRepository,
    @inject('ActivityRepository') activityRepository: IActivityRepository,
    

  ) {
    this._clientRepository = clientRepository
    this._clientTenantRepository = clientTenantRepository
    this._contentRepository = contentRepository
    this._agencyTenantRepository = agencyTenantRepository
    this._invoiceRepository = invoiceRepository
    this._paymentService = paymentService
    this._transactionTenantRepository = transactionTenantRepository
    this._activityRepository = activityRepository
  }

  async clientLoginHandler(
    email: string,
    password: string
  ): Promise<string> {
    const clientDetails = await this._clientRepository.findClientWithMail(email);
    if (!clientDetails) throw new NotFoundError('Account not found');
    if (clientDetails?.isBlocked) throw new UnauthorizedError('Account is blocked');

    const isValid = await comparePassword(password, clientDetails.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    return clientDetails._id as string
  }

  async verifyClient(
    client_id: string
  ): Promise<Partial<IClientType> | null>{
    const client = await this._clientRepository.findClientWithId(client_id)
    return ClientMapper.ClientDetailsMapper(client as IClient)
  }

  async getClientDetails(
    orgId: string,
    email: string
  ): Promise<IClientTenant | null> {
    return await this._clientTenantRepository.getClientDetailsByMail(orgId, email)
  }

  async getClientTenantDetailsById(
    orgId: string,
    client_id: string
  ): Promise<IClientTenant | null> {
    return await this._clientTenantRepository.getClientById(orgId, client_id)
  }


  async getOwners(
    orgId: string
  ): Promise<IAgencyTenant[] | null> {
    return await this._agencyTenantRepository.getOwners(orgId)
  }



  async getClientInMainDb(
    email: string
  ): Promise<IClient | null> {
    const client = await this._clientRepository.findClientWithMail(email)
    return client
  }

  async initiateRazorpayPayment(orgId:string,invoice_id:string):Promise<IRazorpayOrder | null>{
    const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
    const invoice = await this._invoiceRepository.getInvoiceById(orgId,invoice_id)
    const paymentCredentials = owner.paymentCredentials.razorpay
    return await this._paymentService.razorpay({amount:invoice.pricing,currency:"USD"},decryptToken(paymentCredentials.secret_id),decryptToken(paymentCredentials.secret_key))
  }

  async verifyInvoicePayment(orgId:string,invoice_id:string,response:IRazorpayOrder):Promise<void>{
    const invoice = await this._invoiceRepository.getInvoiceById(orgId,invoice_id)
    if(!invoice)throw new NotFoundError("invoice not found.")
    const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
    const paymentCredentials = owner.paymentCredentials.razorpay

    const generatedSignature = crypto
      .createHmac('sha256', decryptToken(paymentCredentials.secret_key))
      .update(`${response.razorpay_order_id}|${response.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== response.razorpay_signature) throw new CustomError("Invalid payment signature",400)
    
      await this._invoiceRepository.updateInvoiceStatus(orgId,invoice_id)
      const transaction = {
        orgId,
        userId: invoice.client.clientId,
        email: invoice.client.email,
        transactionId:response.razorpay_order_id,
        amount:invoice.pricing,
        description:`Invoice ${invoice.invoiceNumber} from ${invoice.client.clientName} has been paid`,
        currency:"USD",
        transactionType:"invoice_payment"
      }
      await this._transactionTenantRepository.createTransaction(orgId,transaction)
      const activity = {
        user:{
          userId:invoice.client.clientId,
          username:invoice.client.clientName,
          email:invoice.client.email
        },
        activityType:"invoice_payment",
        activity:`Invoice ${invoice.invoiceNumber} from ${invoice.client.clientName} has been paid`,
        redirectUrl:"invoices/payments",
        entity:{
          type:"client",
          id:owner._id.toString()
        }
      }
      await this._activityRepository.createActivity(orgId,activity)

  }
  

}
