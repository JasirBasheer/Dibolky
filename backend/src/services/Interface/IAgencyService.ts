import { IClient } from "../../models/agency/client.model";

export interface IAgencyService {
    getProjectsCount(tenantDb:any):Promise<any>
    getClientsCount(tenantDb:any):Promise<any>
    

    agencyLoginHandler(email: string, password: string): Promise<any>;
    verifyOwner(id: string): Promise<any>;
    createClient(db:any,orgId: string, name: string, email: string, industry: string, socialMedia_credentials: any,services:any,menu:string[],organizationName:string): Promise<IClient | void>;
    saveAgencySocialMediaTokens(orgId:string,Provider:string,token:string,tenantDb:any):Promise<any>;
    getAllClients(orgId:string):Promise<any>
    getClient(db:any,id:string):Promise<any>
    saveContentToDb(id:string,orgId:string,tenantDb:any,files: any,platforms:any,contentType:string,caption:string):Promise<any>
    getContent(tenantDb:any,contentId:any):Promise<any>
    changeContentStatus(tenantDb:any,contentId:any,status:string):Promise<any>
    getAvailableUsers(tenantDb:any):Promise<any>
    
    editProjectStatus(tenantDb:any,projectId:string,status:string):Promise<any>

    
}