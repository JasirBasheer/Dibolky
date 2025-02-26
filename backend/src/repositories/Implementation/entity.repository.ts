import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agency.model";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgency, IAgencyOwner } from "../../shared/types/agency.types";
import { IInfluencer, IOwnerDetailsSchema } from "../../shared/types/influencer.types";
import Influencer from "../../models/influencer/influencer.model";


export default class EntityRepository implements IEntityRepository {

    async createAgency(
        new_agency: object
    ): Promise<Partial<IAgencyOwner> | null> {
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
    ): Promise<any> {
        const db = await connectTenantDB(orgId)
        const AgencyModel = db.model('OwnerDetail', ownerDetailsSchema)
        const agency = new AgencyModel(new_agency)
        return await agency.save()
    }

    async saveDetailsInfluencerDb(
        influencer_id: string, 
        orgId: string
    ): Promise<any> {
        const db = await connectTenantDB(orgId)
        const InfluencerModel = db.model('OwnerDetail', ownerDetailsSchema)
        const influencer = new InfluencerModel({
            ownerId: influencer_id,
            orgId: orgId
        })
        return await influencer.save()
    }   


    async getAllAgencyOwners(): Promise<Partial<IAgency[]> | null> {
        return await Agency.find()
    }

    async getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null> {
        return await Agency.find().limit(10)
    }


    async fetchOwnerDetails(tenantDb: any): Promise<any> {
        console.log('reached hereeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        return await tenantDb.find({})
    }



}

