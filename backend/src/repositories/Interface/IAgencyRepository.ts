import { IClient } from "../../models/agency/clientModel";
import { IAgencyOwner } from "../../shared/types/agencyTypes";

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
    getClientReviewBucket(clientId:string,db:any):Promise<any>;
    getContentById(clientId:string,db:any):Promise<any>;
    changeContentStatusById(contentId:string,db:any,status:string):Promise<any>;
  }
  