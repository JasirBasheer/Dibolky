import { CustomError } from '../../shared/utils/CustomError';
import bcrypt from 'bcrypt'
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { IAdminRepository } from '../../repositories/Interface/IAdminRepository';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IAgencyRepository } from '../../repositories/Interface/IAgencyRepository';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../Interface/IAdminService';
import { ICompanyRepository } from '../../repositories/Interface/ICompanyRepository';

@injectable()
export default class AdminService implements IAdminService {
    private planRepository: IPlanRepository;
    private adminRepository: IAdminRepository;
    private entityRepository: IEntityRepository;
    private agencyRepository: IAgencyRepository;
    private companyRepository: ICompanyRepository;

    constructor(
        @inject('IPlanRepository') planRepository : IPlanRepository,
        @inject('IAdminRepository') adminRepository : IAdminRepository,
        @inject('IEntityRepository') entityRepository : IEntityRepository,
        @inject('IAgencyRepository') agencyRepository : IAgencyRepository,
        @inject('ICompanyRepository') companyRepository : ICompanyRepository,
    ) {
        this.planRepository = planRepository;
        this.adminRepository = adminRepository;
        this.entityRepository = entityRepository;
        this.agencyRepository = agencyRepository;
        this.companyRepository = companyRepository;
    }

    async adminLoginHandler(email: string, password: string):Promise<any> {
            const admin = await this.adminRepository.findAdminWithMail(email)
            if (!admin) throw new CustomError('Admin Not found', 404)
            let isValidPassword = await bcrypt.compare(password, admin.password)
            if (!isValidPassword) throw new CustomError("Invalid credentials", 401)
    }
    

    async verifyAdmin(email: string): Promise<any> {
            const admin = await this.adminRepository.findAdminWithMail(email)
            if (!admin) throw new CustomError('Admin Not found', 404)
            return admin
    }

    async getAllPlans(): Promise<any> {
            let companyPlans = await this.planRepository.getCompanyPlans()
            let agencyPlans = await this.planRepository.getAgencyPlans()
            return {
                Agency: agencyPlans,
                Company: companyPlans
            }
    }

    async getPlan(plans: any, id: any, platform: any): Promise<any> {
        const plan = plans[platform].find((elem: any) => elem._id.toString() === id.toString());
        if (!plan) return null
        return plan
    }


    async getAgencyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getAgencyPlan(planId)
        return plan.menu
    }

    async getCompanyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getCompanyPlan(planId)
        return plan.menu
    }

    async getRecentClients() {
            let companies = await this.entityRepository.getAllRecentCompanyOwners()
            let agencies = await this.entityRepository.getAllRecentAgencyOwners()
            let result = { Agency: agencies, Company: companies }
            return result
    }

    async getClient(id: string, role: string): Promise<any> {
            let clientDetials;
            
            if (role == "Agency") {
                const details = await this.agencyRepository.findAgencyWithId(id)
                if(!details)throw new CustomError('Agency Not Found',404)
                const transactions = await this.entityRepository.getTransactionsWithOrgId(details?.orgId)
                clientDetials ={details,transactions}
                
            } else if (role == "Company") {
                const details = await this.companyRepository.findCompanyWithId(id)
                if(!details)throw new CustomError('Company Not Found',404)
                const transactions = await this.entityRepository.getTransactionsWithOrgId(id)
                clientDetials = {details,transactions}
            }
            return clientDetials
    }


    async getAllClients() : Promise<any>{
            let companies = await this.entityRepository.getAllCompanyOwners()
            let agencies = await this.entityRepository.getAllAgencyOwners()
            let result = { Agency: agencies, Company: companies }
            return result
    }


}


