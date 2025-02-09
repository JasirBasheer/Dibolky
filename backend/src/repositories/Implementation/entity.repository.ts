import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agency.model";
import Transaction from "../../models/admin/transaction.model";
import Company from "../../models/company/company.model";
import { departmentSchema } from "../../models/agency/department.model";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { planDetails } from "../../shared/types/admin.types";

export default class EntityRepository implements IEntityRepository {
    async createAgency(newAgency: any): Promise<any> {
        const agency = new Agency(newAgency)
        return await agency.save()
    }

    async createCompany(newCompany: any): Promise<any> {
        const company = new Company(newCompany)
        return await company.save()
    }


    async isAgencyMailExists(email: string): Promise<any> {
        return await Agency.findOne({ email: email })
    }

    async createDepartment(details: any): Promise<any> {
        const { department, permissions } = details
        const DB = await connectTenantDB('vicigrow333986')
        const departmentModel = DB.model('department', departmentSchema)
        const newDepartment = new departmentModel({
            department,
            permissions
        })
        const createdDepartment = await newDepartment.save()
        return createdDepartment
    }


    async isCompanyMailExists(email: string): Promise<any> {
        return await Company.findOne({ email: email })
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

    async getAllCompanyOwners():Promise<any> {
        return await Company.find()
    }
    async getAllAgencyOwners():Promise<any> {
        return await Agency.find()
    }

    async getAllRecentCompanyOwners():Promise<any> {
        return await Company.find().limit(10)
    }
    async getAllRecentAgencyOwners():Promise<any> {
        return await Agency.find().limit(10)
    }

    async getTransactionsWithOrgId(id: string):Promise<any> {
        return await Transaction.find({ orgId: id })
    }



}

