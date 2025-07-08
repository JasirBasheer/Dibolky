import { Model } from "mongoose";
import { ITransaction } from "../../models/transaction";
import { IAgency, IAgencyTenant } from "../../types/agency";

export interface IEntityRepository {
    createAgency(newAgency: object): Promise<Partial<IAgency> | null>;
    isAgencyMailExists(email: string): Promise<IAgency | null>;
    saveDetailsInAgencyDb(new_agency: object, orgId: string): Promise<IAgencyTenant>
    getAllAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    fetchOwnerDetails(tenantDb: Model<IAgencyTenant>): Promise<IAgencyTenant[]>;
}