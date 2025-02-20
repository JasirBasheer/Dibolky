import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agency.model";
import Transaction from "../../models/admin/transaction.model";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { IAgency } from "../../shared/types/agency.types";


export default class EntityRepository implements IEntityRepository {

    async createAgency(
        new_agency: any
    ): Promise<any | void> {
        const agency = new Agency(new_agency)
        return await agency.save()
    }


    async isAgencyMailExists(
        email: string
    ): Promise<IAgency | null> {
        return await Agency.findOne({ email: email })
    }


    async saveDetailsInAgencyDb(id: string, orgId: string): Promise<any> {
        const db = await connectTenantDB(orgId)
        const AgencyModel = db.model('OwnerDetail', ownerDetailsSchema)
        const agency = new AgencyModel({
            ownerId: id,
            orgId: orgId
        })
        return await agency.save()
    }

    async createTransaction(transaction: any):Promise<any> {
        const newTransaction = new Transaction(transaction)
        return await newTransaction.save()
    }

    async getAllAgencyOwners():Promise<any> {
        return await Agency.find()
    }

    async getAllRecentAgencyOwners():Promise<any> {
        return await Agency.find().limit(10)
    }

    async getTransactionsWithOrgId(id: string):Promise<any> {
        return await Transaction.find({ orgId: id })
    }


    async fetchOwnerDetails(tenantDb:any):Promise<any>{
        return await tenantDb.find()
    }

    async fetchAllProjects(projectsModel:any):Promise<any>{
        const projects = await projectsModel.find({}).lean()
        return projects
    }



    async fetchProjectTasks(taskModel:any,projectId:string):Promise<any>{
        return await taskModel.find({projectId:projectId})
    }


}

