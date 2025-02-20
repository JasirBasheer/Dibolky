import { IClient } from "../../models/agency/client.model";
import { IAgencyOwner } from "../../shared/types/agency.types";

export interface IAgencyRepository {
    findAgencyWithMail(email: string): Promise<IAgencyOwner | null>;
    findAgencyWithId(id: string): Promise<IAgencyOwner | null>;
    findAgencyWithOrgId(orgId: string): Promise<IAgencyOwner | null>;
    isClientExists(email: string): Promise<IClient | void>;
    createClient(clientModel: any, details: any): Promise<IClient | void>;
    saveClientToMainDB(details: any): Promise<any>;
    changePassword(id: string, password: string): Promise<any>;
    setSocialMediaTokens(orgId:string,Provider:string,token:string,db:any): Promise<any>;
    getAllClients(db:any): Promise<any>;
    getClientById(db:any,id:string): Promise<any>;
    saveContentToDb(ReviewBucket:any,details:any): Promise<any>;
    getContentById(clientId:string,db:any):Promise<any>;
    changeContentStatusById(contentId:string,db:any,status:string):Promise<any>;
    fetchAllAvailableUsers(clientModel:any):Promise<any>
    createProject(projectModel:any,clientId:string,clientName:string,serviceName:string,project:any,category:string ,deadLine:Date):Promise<any>
    getProjectsCount(projectModel:any):Promise<any>
    getClientsCount(clientModel:any):Promise<any>
    editProjectStatus(projectModel:any,projectId:string,status:string):Promise<any>
  }
  