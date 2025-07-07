import { Model } from "mongoose";
import { ITransaction } from "../../models/transaction";
import { IAgency, IAgencyTenant } from "../../types/agency";
import { IInfluencer } from "../../types/influencer";

export interface IEntityRepository {
    createAgency(newAgency: object): Promise<Partial<IAgency> | null>;
    createInfluencer(newInfluencer: object): Promise<Partial<IInfluencer> | null>;
    isAgencyMailExists(email: string): Promise<IAgency | null>;
    isInfluencerMailExists(email: string): Promise<IInfluencer | null>;
    saveDetailsInAgencyDb(new_agency: object, orgId: string): Promise<IAgencyTenant>
    saveDetailsInfluencerDb(influencer_id: string, orgId: string): Promise<Partial<IInfluencer>>;
    getAllAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    fetchOwnerDetails(tenantDb: Model<IAgencyTenant>): Promise<IAgencyTenant[]>;
}