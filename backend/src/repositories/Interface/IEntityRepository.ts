import { ITransaction } from "../../models/admin/transaction.model";
import { IAgency, IAgencyOwner } from "../../shared/types/agency.types";
import { IInfluencer } from "../../shared/types/influencer.types";

export interface IEntityRepository {
    createAgency(newAgency: object): Promise<Partial<IAgencyOwner> | null>;
    createInfluencer(newInfluencer: object): Promise<Partial<IInfluencer> | null>;
    isAgencyMailExists(email: string): Promise<IAgency | null>;
    isInfluencerMailExists(email: string): Promise<IInfluencer | null>;
    saveDetailsInAgencyDb(new_agency: object, orgId: string): Promise<any>
    saveDetailsInfluencerDb(influencer_id: string, orgId: string): Promise<any>;
    getAllAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    fetchOwnerDetails(tenantDb: any): Promise<any>;
}