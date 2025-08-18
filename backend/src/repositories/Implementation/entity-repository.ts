import { connectTenantDB } from "../../config/db.config";
import Agency, { agencyTenantSchema } from "../../models/Implementation/agency";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgencyType, IAgencyTenant } from "../../types/agency";
import mongoose, { Model } from "mongoose";
import { IAgency } from "@/models/Interface/agency";

export class EntityRepository implements IEntityRepository {




  async fetchOwnerDetails(
    tenantDb: Model<IAgencyTenant>
  ): Promise<IAgencyTenant[]> {
    return await tenantDb.find({});
  }
}
