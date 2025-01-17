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
  }
  