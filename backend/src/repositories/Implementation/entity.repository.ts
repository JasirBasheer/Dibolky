import { connectTenantDB } from "../../config/db.config";
import Agency, { agencyTenantSchema } from "../../models/agency";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgency, IAgencyTenant } from "../../types/agency";
import { IInfluencer } from "../../types/influencer";
import Influencer from "../../models/influencer";
import {  Model } from "mongoose";
import { CustomError } from "mern.common";


export default class EntityRepository implements IEntityRepository {

    async createAgency(
        new_agency: object
    ): Promise<Partial<IAgency> | null> {
        const agency = new Agency(new_agency)
        return await agency.save()
    }



    async isAgencyMailExists(
        agency_mail: string
    ): Promise<IAgency | null> {
        return await Agency.findOne({ email: agency_mail })
    }






    async saveDetailsInAgencyDb(
        new_agency: object, 
        orgId: string
    ): Promise<IAgencyTenant> {
        const db = await connectTenantDB(orgId)
        const AgencyModel = db.model('OwnerDetail', agencyTenantSchema)
        const agency = new AgencyModel(new_agency)
        return await agency.save()
    }
  


    async getAllAgencyOwners(): Promise<Partial<IAgency[]> | null> {
        return await Agency.find()
    }

    async getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null> {
        return await Agency.find().limit(10)
    }


    async fetchOwnerDetails(
        tenantDb: Model<IAgencyTenant>
    ): Promise<IAgencyTenant[]> {
        return await tenantDb.find({})
    }



}

