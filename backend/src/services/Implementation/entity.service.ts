import { addMonthsToDate } from '../../shared/utils/date-utils';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { inject, injectable } from 'tsyringe';
import { ConflictError, CustomError, generatePassword, hashPassword, sendMail } from 'mern.common';
import { departmentSchema } from '../../models/agency/department.model';
import employeeModel, { employeeSchema } from '../../models/employee/employee.model';
import mongoose from 'mongoose';
import { createClientMailData } from '../../shared/utils/mail.datas';
import { NotFoundError } from 'rxjs';
import { createNewPlanMenu } from '../../shared/utils/menu.utils';
import { ownerDetailsSchema } from '../../models/agency/agency.model';

@injectable()
export default class EntityService implements IEntityService {
    private entityRepository: IEntityRepository;
    private planRepository: IPlanRepository;

    constructor(
        @inject('EntityRepository') entityRepository: IEntityRepository,
        @inject('PlanRepository') planRepository: IPlanRepository

    ) {
        this.entityRepository = entityRepository
        this.planRepository = planRepository
    }


    async getAllPlans(): Promise<any> {
        let companyPlans = await this.planRepository.getCompanyPlans()
        let agencyPlans = await this.planRepository.getAgencyPlans()
        return {
            Agency: agencyPlans,
            Company: companyPlans
        }

    }

    async IsMailExists(Mail: string, platform: string): Promise<any> {
        if (platform == "Agency") {
            const isExists = await this.entityRepository.isAgencyMailExists(Mail)
            if (isExists) return true
            return false

        } else if (platform == "Company") {
            const isExists = await this.entityRepository.isCompanyMailExists(Mail)
            if (isExists) return true
            return false
        }
        return null

    }

    async getPlan(plans: any, id: any, platform: any) {
        const plan = plans[platform].find((elem: any) => elem._id.toString() === id.toString());
        if (!plan) return null
        return plan
    }

    async registerAgency(organizationName: string, name: string, email: string, address: any, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string, currency: string): Promise<any> {

        const hashedPassword = await hashPassword(password)
        let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);
        let validityInDate = addMonthsToDate(validity)

        const newAgency = {
            orgId, planId, validity: validityInDate, organizationName, name,
            email, address, websiteUrl, industry, contactNumber, logo, password: hashedPassword,
            planPurchasedRate: planPurchasedRate, currency
        };
        const ownerDetails = await this.entityRepository.createAgency(newAgency);


        const newTransaction = {
            orgId, email, userId: ownerDetails._id,
            planId, paymentGateway, transactionId,
            amount: planPurchasedRate, description,
            currency
        }

        await this.entityRepository.createTransaction(newTransaction)
        await this.entityRepository.saveDetailsInAgencyDb(ownerDetails._id, ownerDetails.orgId)
        return ownerDetails
    }



    async registerCompany(organizationName: string, name: string, email: string, address: any, websiteUrl: string,
        industry: string, contactNumber: number, logo: string, password: string): Promise<any> {
        const hashedPassword = await hashPassword(password)
        let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);

        const newCompany = {
            orgId, organizationName,
            name, email, address,
            websiteUrl, industry,
            contactNumber, logo,
            password: hashedPassword,
        };

        const createdCompany = await this.entityRepository.createCompany(newCompany)
        return createdCompany

    }

    async getAgencyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getAgencyPlan(planId)
        return plan.menu
    }

    async getCompanyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getCompanyPlan(planId)
        return plan.menu
    }

    async createDepartment(tenantDatabase: any, department: string, permissions: string[]): Promise<void> {
        const departmentModel = await tenantDatabase.model('department', departmentSchema);
        const menu = createNewPlanMenu(permissions)
        const details = { department,permissions,menu }
        const createdDepartment = await this.entityRepository.createDepartment(departmentModel, details);
        if (!createdDepartment) throw new CustomError("Error while creating Department", 500)
    }

    async createEmployee(orgId: string, orgName: string, tenantDatabase: any, name: string, email: string, role: string, department: string): Promise<void> {
        const employeeModel = await tenantDatabase.model('employee', employeeSchema)
        let password = await generatePassword(orgName)

        const employee = await this.entityRepository.findEmployeeWithEmail(email)
        if (employee) throw new ConflictError('Employee already exists with this email')

        await this.entityRepository.createEmployee(orgId, employeeModel, name, email, role, password, department)
        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), orgName, password)
        sendMail(
            email,
            `Welcome to ${orgName}! Excited to Work with You`,
            data,
            (error: any, info: any) => {
                if (error) {
                    console.error("Failed to send email:", error);
                } else {
                    console.log("Email sent successfully:", info.response);
                }
            }
        );
    }

    async getDepartments(tenantDb:any):Promise<any>{
        const departmentModel = await tenantDb.model('department', departmentSchema);
        return await this.entityRepository.fetchAllDepartments(departmentModel)
    }

    async getEmployees(tenantDb:any):Promise<any>{
        const employeeModel = await tenantDb.model('employee', employeeSchema);
        return await this.entityRepository.fetchAllEmployees(employeeModel)
    }

    async  getOwner(tenantDb:any):Promise<any>{
        const ownerDetailModel = await tenantDb.model('OwnerDetail', ownerDetailsSchema);
        return await this.entityRepository.fetchOwnerDetails(ownerDetailModel)
    }



}


