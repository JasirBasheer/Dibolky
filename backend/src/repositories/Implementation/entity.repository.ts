import { connectTenantDB } from "../../config/db";
import Agency, { ownerDetailsSchema } from "../../models/agency/agency.model";
import Transaction from "../../models/admin/transaction.model";
import Company from "../../models/company/company.model";
import { departmentSchema } from "../../models/agency/department.model";
import { IEntityRepository } from "../Interface/IEntityRepository";
import { planDetails } from "../../shared/types/admin.types";
import mongoose from "mongoose";
import  employeeSchema  from "../../models/employee/employee.model";

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

    async createDepartment(departmentModel:any,details:any):Promise<any>{
        const newDepartment = new departmentModel(details)
        return await newDepartment.save()
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
    async createEmployee(orgId:string,tenantDatabase:any,name:string,email:string,role:string,password:string,department:string):Promise<any>{
        let employee = new employeeSchema({orgId,name,email,password,department,role})
        await employee.save()
        employee = new tenantDatabase({orgId,name,email,password,department})
        await employee.save()       
    }

    async findEmployeeWithEmail(email:string):Promise<any>{
        return await employeeSchema.findOne({email:email})
    }
    async findOrganizationWithOrgId(orgId:string):Promise<any>{
    }
    async fetchAllDepartments(tenantDb:any):Promise<any>{
        return await tenantDb.find()
    }

    async fetchAllEmployees(tenantDb:any):Promise<any>{
        return await tenantDb.find()
    }

    async fetchOwnerDetails(tenantDb:any):Promise<any>{
        return await tenantDb.find()
    }




}

