import { IClient } from "../../models/agency/clientModel";
import { IAgencyOwner } from "../../shared/types/agencyTypes";

export interface IAgencyService {
    agencyLoginHandler(email: string, password: string): Promise<IAgencyOwner | null>;
    verifyOwner(email: string): Promise<IAgencyOwner | null>;
    createClient(clientModel: any, orgId: string, name: string, email: string, industry: string, socialMedia_credentials: any): Promise<IClient | void>;
}