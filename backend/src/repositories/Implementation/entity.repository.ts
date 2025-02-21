import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agency.model";
import Transaction, { ITransaction } from "../../models/admin/transaction.model";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgency } from "../../shared/types/agency.types";


export default class EntityRepository implements IEntityRepository {

    async createAgency(
        new_agency: Partial<IAgency>
    ): Promise<IAgency | null> {
        const agency = new Agency(new_agency)
        return await agency.save()
    }


    async isAgencyMailExists(
        agency_mail: string
    ): Promise<IAgency | null> {
        return await Agency.findOne({ email: agency_mail })
    }


    async saveDetailsInAgencyDb(agency_id: string, orgId: string): Promise<any> {
        const db = await connectTenantDB(orgId)
        const AgencyModel = db.model('OwnerDetail', ownerDetailsSchema)
        const agency = new AgencyModel({
            ownerId: agency_id,
            orgId: orgId
        })
        return await agency.save()
    }


    async getAllAgencyOwners(): Promise<Partial<IAgency[]> | null> {
        return await Agency.find()
    }

    async getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null> {
        return await Agency.find().limit(10)
    }


    async fetchOwnerDetails(tenantDb: any): Promise<any> {
        return await tenantDb.find()
    }

    async fetchAllProjects(projectsModel: any): Promise<any> {
        const projects = await projectsModel.find({}).lean()
        return projects
    }


}

