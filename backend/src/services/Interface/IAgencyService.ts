import { IAgency, IOwnerDetailsSchema, IReviewBucket } from "../../shared/types/agency.types";
import { IClient, IClientTenant } from "../../shared/types/client.types";

export interface IAgencyService {
    verifyOwner(agency_id: string): Promise<IAgency | null>;
    getAgencyOwnerDetails(orgId:string):Promise<IOwnerDetailsSchema | null>;
    agencyLoginHandler(email: string, password: string): Promise<string>;
    getProjectsCount(orgId:string):Promise<object>
    getClientsCount(orgId:string):Promise<object>
    getAllAvailableClients(orgId:string):Promise<IClientTenant[]>
    createClient(orgId: string, name: string, email: string, industry: string, services:any,menu:string[],organizationName:string): Promise<IClient | void>;
    getAllClients(orgId:string):Promise<IClientTenant[] | null>
    getClient(orgId:string,client_id:string):Promise<IClientTenant | null>
    saveContentToDb(client_id:string,orgId:string,files: any,platforms:any,contentType:string,caption:string):Promise<IReviewBucket | null>
    getContent(orgId: string, contentId: string):Promise<IReviewBucket | null>
    changeContentStatus(orgId: string, contentId: string, status: string):Promise<IReviewBucket | null>
    editProjectStatus(orgId:string,projectId:string,status:string):Promise<IReviewBucket | null>
    getInitialSetUp(orgId:string):Promise<object>
    
}