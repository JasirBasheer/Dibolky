import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agency.model";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgency, IAgencyTenant } from "../../shared/types/agency.types";
import { IInfluencer } from "../../shared/types/influencer.types";
import Influencer from "../../models/influencer/influencer.model";
import {  Model } from "mongoose";
import { CustomError } from "mern.common";


export default class EntityRepository implements IEntityRepository {

    async createAgency(
        new_agency: object
    ): Promise<Partial<IAgency> | null> {
        const agency = new Agency(new_agency)
        return await agency.save()
    }

    createInfluencer(
        newInfluencer: object
    ): Promise<Partial<IInfluencer>  | null>{
        const influencer = new Influencer(newInfluencer)
        return influencer.save()
    }


    async isAgencyMailExists(
        agency_mail: string
    ): Promise<IAgency | null> {
        return await Agency.findOne({ email: agency_mail })
    }

    async isInfluencerMailExists(
        agency_mail: string
    ): Promise<IInfluencer | null> {
        return await Influencer.findOne({ email: agency_mail })
    }





    async saveDetailsInAgencyDb(
        new_agency: object, 
        orgId: string
    ): Promise<IAgencyTenant> {
        const db = await connectTenantDB(orgId)
        const AgencyModel = db.model('OwnerDetail', ownerDetailsSchema)
        const agency = new AgencyModel(new_agency)
        return await agency.save()
    }

    async saveDetailsInfluencerDb(
        influencer_id: string, 
        orgId: string
    ): Promise<Partial<IInfluencer>> {
        const db = await connectTenantDB(orgId)
        const InfluencerModel = db.model('OwnerDetail', ownerDetailsSchema)
        const influencer = new InfluencerModel({
            main_id: influencer_id,
            orgId: orgId
        })
        const newInfluencer =  await influencer.save()
        if(!newInfluencer)throw new CustomError("Error while creating influencer",500)
        return newInfluencer as Partial<IInfluencer>
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

