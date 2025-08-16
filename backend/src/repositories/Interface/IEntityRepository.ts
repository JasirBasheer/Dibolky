import mongoose, { Model } from "mongoose";
import { IAgencyType, IAgencyTenant } from "../../types/agency";
import { IAgency } from "@/models/Interface/agency";

export interface IEntityRepository {
    isAgencyMailExists(email: string): Promise<IAgencyType | null>;
    saveDetailsInAgencyDb(new_agency: object, orgId: string): Promise<IAgencyTenant>
    fetchOwnerDetails(tenantDb: Model<IAgencyTenant>): Promise<IAgencyTenant[]>;
}