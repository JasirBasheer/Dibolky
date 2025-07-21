import { IClient } from "@/models/Interface/client";
import { IAgencyTenant } from "../../types/agency";
import { IClientType } from "../../types/client";
import { IClientTenant } from "@/models";
import { IRazorpayOrder } from "@/types/payment";

export interface IClientService {
    clientLoginHandler(email: string, password: string): Promise<string>;
    verifyClient(client_id:string):Promise<Partial<IClientType> | null>;
    getClientDetails(orgId:string,email:string):Promise<IClientTenant | null>
    getClientTenantDetailsById(orgId:string,client_id:string):Promise<IClientTenant | null>
    getOwners(orgId:string):Promise<IAgencyTenant[] | null>
    getClientInMainDb(email:string):Promise<IClient | null>;
    initiateRazorpayPayment(orgId:string,invoice_id:string):Promise<IRazorpayOrder | null>;
    verifyInvoicePayment(orgId:string,invoice_id:string,response:IRazorpayOrder):Promise<void>;
}