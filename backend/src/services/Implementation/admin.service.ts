import bcrypt from 'bcrypt'
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { IAdminRepository } from '../../repositories/Interface/IAdminRepository';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IAgencyRepository } from '../../repositories/Interface/IAgencyRepository';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../Interface/IAdminService';
import { CustomError, NotFoundError, UnauthorizedError } from 'mern.common';
import { IAdmin, IPlan, planDetails, Plans } from '../../types/admin.types';
import { ITransactionRepository } from '../../repositories/Interface/ITransactionRepository';
import { createNewPlanMenu } from '../../utils/menu.utils';
import { ROLES } from '../../utils/constants.utils';

@injectable()
export default class AdminService implements IAdminService {
    private planRepository: IPlanRepository;
    private adminRepository: IAdminRepository;
    private entityRepository: IEntityRepository;
    private agencyRepository: IAgencyRepository;
    private transactionRepository: ITransactionRepository;

    constructor(
        @inject('PlanRepository') planRepository: IPlanRepository,
        @inject('AdminRepository') adminRepository: IAdminRepository,
        @inject('EntityRepository') entityRepository: IEntityRepository,
        @inject('AgencyRepository') agencyRepository: IAgencyRepository,
        @inject('TransactionRepository') transactionRepository: ITransactionRepository,
    ) {
        this.planRepository = planRepository;
        this.adminRepository = adminRepository;
        this.entityRepository = entityRepository;
        this.agencyRepository = agencyRepository;
        this.transactionRepository = transactionRepository;
    }

    async adminLoginHandler(
        email: string,
        password: string
    ): Promise<string> {
        const admin = await this.adminRepository.findAdminWithMail(email)
        if (!admin) throw new NotFoundError('Admin Not found')
        let isValidPassword = await bcrypt.compare(password, admin.password)
        if (!isValidPassword) throw new UnauthorizedError("Invalid credentials")
        return admin._id as string
    }


    async verifyAdmin(
        admin_id: string
    ): Promise<IAdmin> {
        const admin = await this.adminRepository.findAdminWithId(admin_id)
        if (!admin) throw new NotFoundError('Admin Not found')
        return admin
    }

    async getAllPlans()
        : Promise<object> {
        let agencyPlans = await this.planRepository.getPlans()
        return {
            Agency: agencyPlans
        }
    }

    async getPlan(
        plans: Plans,
        plan_id: string,
        platform: string
    ): Promise<IPlan | null> {
        const plan = plans[platform]?.find((elem: IPlan) => elem._id as string === plan_id.toString()) || null;
        if (!plan) return null
        return plan
    }




    async getRecentClients()
        : Promise<object> {
        let agencies = await this.entityRepository.getAllRecentAgencyOwners()
        let result = { Agency: agencies }
        return result
    }

    async getClient(
        client_id: string,
        role: string
    ): Promise<object> {
        let clientDetials;
        if (role == "Agency") {
            const details = await this.agencyRepository.findAgencyWithId(client_id)
            if (!details) throw new NotFoundError('Agency Not Found')
            const transactions = await this.transactionRepository.getTransactionsWithOrgId(details?.orgId)
            clientDetials = { details, transactions }
        }
        return clientDetials as object
    }


    async getAllClients()
        : Promise<object | null> {
        let agencies = await this.entityRepository.getAllAgencyOwners()
        let result = { Agency: agencies }
        return result
    }

    async createPlan(
        details: planDetails
    ): Promise<void> {
        let menu = createNewPlanMenu(details.menu as string[])
        details.menu = menu
        const createdPlan = await this.planRepository.createPlan(details)
        if (!createdPlan) throw new CustomError("Error While creating Plan", 500)
    }

    async editPlan(
        entity: string,
        details: planDetails
    ): Promise<void> {
        let editedPlan;
        let menu = createNewPlanMenu(details.menu as string[])
        details.menu = menu
        if (entity == "Agency") {
            editedPlan = await this.planRepository.editPlan(details)
        }
        if (!editedPlan) throw new CustomError("Error While editing Plan", 500)
    }

    async changePlanStatus(
        entity: string,
        plan_id: string,
    ): Promise<void> {
        let changedStatus;
        if (entity == "Agency") {
            changedStatus = await this.planRepository.changePlanStatus(plan_id)
        }
        if (!changedStatus) throw new CustomError("Error While changing Plan status", 500)
    }

    async getPlanDetails(
        entity: string,
        plan_id: string
    ): Promise<object> {
        let details;
        if (entity == "Agency") {
            const planDetails = await this.planRepository.getPlan(plan_id)
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
                planConsumers: consumers
            }
        }
        return details as object
    }
}


