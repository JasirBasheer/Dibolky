import { hashPassword } from '../../shared/utils/passwordUtils';
import { addMonthsToDate } from '../../shared/utils/utils';
import { CustomError } from '../../shared/utils/CustomError';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class EntityService implements IEntityService {
    private entityRepository: IEntityRepository;
    private planRepository: IPlanRepository;

    constructor(
        @inject('IEntityRepository') entityRepository : IEntityRepository,
        @inject('IPlanRepository') planRepository : IPlanRepository

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
        transactionId: string, paymentGateway: string, description: string): Promise<any> {

            const hashedPassword = await hashPassword(password)
            let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);
            let validityInDate = addMonthsToDate(validity)

            const newAgency = {
                orgId, planId, validity: validityInDate, organizationName, name,
                email, address, websiteUrl, industry, contactNumber, logo, password: hashedPassword,
                planPurchasedRate: planPurchasedRate
            };
            const ownerDetails = await this.entityRepository.createAgency(newAgency);

            const newTransaction = {
                orgId, email, userId: ownerDetails._id,
                planId, paymentGateway, transactionId,
                amount: planPurchasedRate, description
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
            orgId,organizationName,
            name,email,address,
            websiteUrl,industry,
            contactNumber,logo,
            password: hashedPassword,
        };

        const createdCompany = await this.entityRepository.createCompany(newCompany)
        return createdCompany

    }

    async getAgencyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getAgencyPlan(planId)
        return plan.menu
    }

    async getCompanyMenu(planId: string) : Promise<any>{
        const plan = await this.planRepository.getCompanyPlan(planId)
        return plan.menu
    }

}


