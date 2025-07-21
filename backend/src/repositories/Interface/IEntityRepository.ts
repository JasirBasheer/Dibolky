import { Model } from "mongoose";
import { IAgencyType, IAgencyTenant } from "../../types/agency";
import { IAgency } from "@/models/Interface/agency";

export interface IEntityRepository {
    createAgency(newAgency: object): Promise<Partial<IAgency>>;
    isAgencyMailExists(email: string): Promise<IAgencyType | null>;
    saveDetailsInAgencyDb(new_agency: object, orgId: string): Promise<IAgencyTenant>
    getAllAgencyOwners(): Promise<IAgency[] | null>;
    getAllRecentAgencyOwners(): Promise<IAgency[] | null>;
    fetchOwnerDetails(tenantDb: Model<IAgencyTenant>): Promise<IAgencyTenant[]>;
}