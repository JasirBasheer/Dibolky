import bcrypt from 'bcrypt'
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { IAdminRepository } from '../../repositories/Interface/IAdminRepository';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IAgencyRepository } from '../../repositories/Interface/IAgencyRepository';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../Interface/IAdminService';
import { CustomError, NotFoundError, UnauthorizedError } from 'mern.common';
import { planDetails } from '../../shared/types/admin.types';
import { createNewPlanMenu } from '../../shared/utils/menu.utils';
import { ITransactionRepository } from '../../repositories/Interface/ITransactionRepository';

@injectable()
export default class AdminService implements IAdminService {
    private planRepository: IPlanRepository;
    private adminRepository: IAdminRepository;
    private entityRepository: IEntityRepository;
    private agencyRepository: IAgencyRepository;
    private transactionRepository: ITransactionRepository;

    constructor(
        @inject('PlanRepository') planRepository : IPlanRepository,
        @inject('AdminRepository') adminRepository : IAdminRepository,
        @inject('EntityRepository') entityRepository : IEntityRepository,
        @inject('AgencyRepository') agencyRepository : IAgencyRepository,
        @inject('TransactionRepository') transactionRepository : ITransactionRepository,
    ) {
        this.planRepository = planRepository;
        this.adminRepository = adminRepository;
        this.entityRepository = entityRepository;
        this.agencyRepository = agencyRepository;
        this.transactionRepository = transactionRepository;
    }

    async adminLoginHandler(email: string, password: string):Promise<any> {
            const admin = await this.adminRepository.findAdminWithMail(email)
            if (!admin) throw new NotFoundError('Admin Not found')
            let isValidPassword = await bcrypt.compare(password, admin.password)
            if (!isValidPassword) throw new UnauthorizedError("Invalid credentials")
            return admin._id
    }
    

    async verifyAdmin(id: string): Promise<any> {
        
            const admin = await this.adminRepository.findAdminWithId(id)
            if (!admin) throw new NotFoundError('Admin Not found')
            return admin
    }

    async getAllPlans(): Promise<any> {
            let agencyPlans = await this.planRepository.getAgencyPlans()
            return {
                Agency: agencyPlans
            }
    }

    async getPlan(plans: any, id: any, platform: any): Promise<any> {
        const plan = plans[platform].find((elem: any) => elem._id.toString() === id.toString());
        if (!plan) return null
        return plan
    }


    async getAgencyMenu(planId: string): Promise<any> {
        const plan = await this.planRepository.getAgencyPlan(planId)
        return plan!.menu
    }



    async getRecentClients() {
        console.log("Recent Clients")
            let agencies = await this.entityRepository.getAllRecentAgencyOwners()
            let result = { Agency: agencies }
            return result
    }

    async getClient(id: string, role: string): Promise<any> {
            let clientDetials;
            
            if (role == "Agency") {
                const details = await this.agencyRepository.findAgencyWithId(id)
                if(!details)throw new NotFoundError('Agency Not Found')
                const transactions = await this.transactionRepository.getTransactionsWithOrgId(details?.orgId)
                clientDetials ={details,transactions}
            }
            return clientDetials
    }


    async getAllClients() : Promise<any>{
            let agencies = await this.entityRepository.getAllAgencyOwners()
            let result = { Agency: agencies }
            return result
    }

    async createPlan(
        entity:string,
        details:planDetails
    ):Promise<void>{
        let createdPlan;
        let menu = createNewPlanMenu(details.menu)
        details.menu = menu
        if(entity == "Agency"){
            createdPlan = await this.planRepository.createAgencyPlan(details)
        }
        if(!createdPlan)throw new CustomError("Error While creating Plan",500)
    }

    async editPlan(
        entity:string,
        details:planDetails
    ):Promise<void>{
        let editedPlan;
        let menu = createNewPlanMenu(details.menu)
        details.menu = menu
        if(entity == "Agency"){
            editedPlan = await this.planRepository.editAgencyPlan(details)
        }
        if(!editedPlan)throw new CustomError("Error While editing Plan",500)
    }

    async changePlanStatus(
        entity:string,
        id:string,
    ):Promise<void>{
        let changedStatus;
        if(entity == "Agency"){
            changedStatus = await this.planRepository.changeAgencyPlanStatus(id)
        }
        if(!changedStatus)throw new CustomError("Error While changing Plan status",500)
    }

    async getPlanDetails(
        entity:string,
        plan_id:string
    ):Promise<any>{
        let details;
        if(entity=="Agency"){
            const planDetails = await this.planRepository.getAgencyPlan(plan_id)
            const planConsumers = await this.agencyRepository.getAgencyPlanConsumers(plan_id)
            const consumers = Array.isArray(planConsumers) 
            ? planConsumers.map((item) => ({
                name: item.name,
                organizationName: item.organizationName,
                validity: item.validity,
                industry: item.industry,
              }))
            : []; 
                
            details = {
                ...planDetails,
                planConsumers:consumers
            }
        }
        return details
    }
}


