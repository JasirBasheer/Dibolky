import { IOwnerDetailsSchema } from "../../shared/types/agency.types";
import { IClient, IClientTenant } from "../../shared/types/client.types";

export interface IClientService {
    clientLoginHandler(email: string, password: string): Promise<string>;
    verifyClient(client_id:string):Promise<IClient | null>;
    getClientDetails(orgId:string,email:string):Promise<IClientTenant | null>
    getOwners(orgId:string):Promise<IOwnerDetailsSchema[] | null>
    
    saveClientSocialMediaTokens(orgId:string,client_id:string,provider:string,token:string):Promise<any>;
    setSocialMediaUserNames(orgId: string, client_id:string, provider: string, username: string): Promise<any>;
    getReviewBucket(orgId: string,clientId: string): Promise<any>
    getClientInMainDb(email:string):Promise<any>;
}