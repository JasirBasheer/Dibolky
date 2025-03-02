import { IAgencyTenant } from "../../shared/types/agency.types";
import { IClient, IClientTenant } from "../../shared/types/client.types";

export interface IClientService {
    clientLoginHandler(email: string, password: string): Promise<string>;
    verifyClient(client_id:string):Promise<IClient | null>;
    getClientDetails(orgId:string,email:string):Promise<IClientTenant | null>
    getClientTenantDetailsById(orgId:string,client_id:string):Promise<IClientTenant | null>
    getOwners(orgId:string):Promise<IAgencyTenant[] | null>
    getClientInMainDb(email:string):Promise<IClient | null>;
}