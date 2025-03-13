import { Model } from "mongoose";
import { ITransaction } from "../../models/admin/transaction.model";
import { IAgency, IAgencyTenant } from "../../types/agency.types";
import { IInfluencer } from "../../types/influencer.types";

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