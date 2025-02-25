import mongoose from 'mongoose';
import { inject, injectable } from 'tsyringe';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { ownerDetailsSchema } from '../../models/agency/agency.model';
import { projectSchema } from '../../models/agency/project.model';
import { addMonthsToDate } from '../../shared/utils/date-utils';
import {
    hashPassword,
} from 'mern.common';

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
        let agencyPlans = await this.planRepository.getAgencyPlans()
        return {
            Agency: agencyPlans,
        }

    }

    async IsMailExists(Mail: string, platform: string): Promise<any> {
        if (platform == "Agency") {
            const isExists = await this.entityRepository.isAgencyMailExists(Mail)
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



    async getAgencyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getAgencyPlan(planId)
        return plan.menu
    }


    async getOwner(tenantDb: any): Promise<any> {
        const ownerDetailModel = await tenantDb.model('OwnerDetail', ownerDetailsSchema);
        return await this.entityRepository.fetchOwnerDetails(ownerDetailModel)
    }

    async fetchAllProjects(tenantDb: any): Promise<any> {
        const projectModel = await tenantDb.model('project', projectSchema)
        return await this.entityRepository.fetchAllProjects(projectModel)
    }





}


