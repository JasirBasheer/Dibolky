import { connectTenantDB } from "../../config/db.config";
import Agency, { agencyTenantSchema } from "../../models/Implementation/agency";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgencyType, IAgencyTenant } from "../../types/agency";
import mongoose, { Model } from "mongoose";
import { IAgency } from "@/models/Interface/agency";

export class EntityRepository implements IEntityRepository {


  async isAgencyMailExists(agency_mail: string): Promise<IAgencyType | null> {
    return await Agency.findOne({ email: agency_mail });
  }

  async saveDetailsInAgencyDb(
    new_agency: object,
    orgId: string
  ): Promise<IAgencyTenant> {
    const db = await connectTenantDB(orgId);
    const AgencyModel = db.model("OwnerDetail", agencyTenantSchema);
    const agency = new AgencyModel(new_agency);
    return await agency.save();
  }



  async fetchOwnerDetails(
    tenantDb: Model<IAgencyTenant>
  ): Promise<IAgencyTenant[]> {
    return await tenantDb.find({});
  }
}
