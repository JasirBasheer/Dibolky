import { inject, injectable } from 'tsyringe';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { ownerDetailsSchema } from '../../models/agency/agency.model';
import { addMonthsToDate } from '../../shared/utils/date-utils';
import {
    CustomError,
    hashPassword,
} from 'mern.common';
import { ITransactionRepository } from '../../repositories/Interface/ITransactionRepository';
import { IPlan } from '../../shared/types/admin.types';
import { IProject } from '../../models/agency/project.model';
import { IProjectRepository } from '../../repositories/Interface/IProjectRepository';
import { IClientTenantRepository } from '../../repositories/Interface/IClientTenantRepository';
import { IContentRepository } from '../../repositories/Interface/IContentRepository';
import { IAgencyTenantRepository } from '../../repositories/Interface/IAgencyTenantRepository';
import { getS3ViewUrl } from '../../config/aws-s3.config';
import { AddressType, IAgency, IAgencyTenant } from '../../shared/types/agency.types';
import { IInfluencer } from '../../shared/types/influencer.types';
import { connectTenantDB } from '../../config/db';
import { IFiles, IMenuCategory, IMetadata, IPlatforms, IReviewBucket } from '../../shared/types/common.types';
import { Types } from 'mongoose';

@injectable()
export default class EntityService implements IEntityService {
    private entityRepository: IEntityRepository;
    private planRepository: IPlanRepository;
    private transactionRepository: ITransactionRepository;
    private projectRepository: IProjectRepository;
    private clientTenantRepository: IClientTenantRepository;
    private contentRepository: IContentRepository;
    private agencyTenantRepository: IAgencyTenantRepository;

    constructor(
        @inject('EntityRepository') entityRepository: IEntityRepository,
        @inject('PlanRepository') planRepository: IPlanRepository,
        @inject('TransactionRepository') transactionRepository: ITransactionRepository,
        @inject('ProjectRepository') projectRepository: IProjectRepository,
        @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ContentRepository') contentRepository: IContentRepository,
        @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,

    ) {
        this.entityRepository = entityRepository
        this.planRepository = planRepository
        this.transactionRepository = transactionRepository
        this.projectRepository = projectRepository
        this.clientTenantRepository = clientTenantRepository
        this.contentRepository = contentRepository
        this.agencyTenantRepository = agencyTenantRepository
    }


    async getAllPlans()
    : Promise<Record<string,IPlan[]>> {
        let agencyPlans = await this.planRepository.getAgencyPlans()
        let influencerPlans = await this.planRepository.getInfluencerPlans()
        return {
            Agency: agencyPlans || [],
            Influencer: influencerPlans || []
        }
    }

    async getPlan(plans:Record<string,IPlan[]>, plan_id: string, platform: string): Promise<Partial<IPlan>>{
        const plan = plans[platform].find((elem) => elem._id as string == plan_id.toString());
        if (!plan) throw new CustomError("Plan not found",500) 
        return plan
        }

    async fetchAllProjects(orgId:string):Promise<Partial<IProject[]> | null> {
        return await this.projectRepository.fetchAllProjects(orgId)
    }
        

    async IsMailExists(
        mail: string, 
        platform: string
    ): Promise<boolean | null> {
        if (platform == "Agency") {
            const isExists = await this.entityRepository.isAgencyMailExists(mail)
            if (isExists) return true
            return false
        }else if (platform == "Influencer") {
            const isExists = await this.entityRepository.isInfluencerMailExists(mail)
            if (isExists) return true
            return false
        }
        return null
    }


    async registerAgency(
        organizationName: string, name: string, 
        email: string, address: AddressType, 
        websiteUrl: string, industry: string,
        contactNumber: number, logo: string, 
        password: string, planId: string, 
        validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, 
        description: string, currency: string
    ): Promise<Partial<IAgency> | null> {

        const hashedPassword = await hashPassword(password)
        let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);
        let validityInDate = addMonthsToDate(validity)

        const newAgency = {
            orgId, planId, validity: validityInDate, organizationName, name,
            email, address, websiteUrl, industry, contactNumber, logo, password: hashedPassword,
            planPurchasedRate: planPurchasedRate, currency
        };

        const ownerDetails = await this.entityRepository.createAgency(newAgency);
        
        const newTenantAgency = {
            ownerId: ownerDetails?._id,orgId,
            planId, organizationName, name,
            email
        };

        const newTransaction = {
            orgId, email, userId: ownerDetails?._id,
            planId, paymentGateway, transactionId,
            amount: planPurchasedRate, description,
            currency
        }

        await this.transactionRepository.createTransaction(newTransaction)
        await this.entityRepository.saveDetailsInAgencyDb(newTenantAgency, orgId as string)
        return ownerDetails
    }



    async createInfluencer(
        organizationName: string, name: string, 
        email: string, address: AddressType, 
        websiteUrl: string, industry: string,
        contactNumber: number, logo: string, 
        password: string, planId: string, 
        validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, 
        description: string, currency: string
    ): Promise<Partial<IInfluencer> | null> {

        const hashedPassword = await hashPassword(password)
        let orgId = name.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);
        let validityInDate = addMonthsToDate(validity)

        const newInfluencer = {
            orgId, planId, validity: validityInDate, organizationName, name,
            email, address, websiteUrl, industry, contactNumber, logo, password: hashedPassword,
            planPurchasedRate: planPurchasedRate, currency
        };
        const ownerDetails = await this.entityRepository.createInfluencer(newInfluencer);


        const newTransaction = {
            orgId, email, userId: ownerDetails?._id,
            planId, paymentGateway, transactionId,
            amount: planPurchasedRate, description,
            currency
        }

        await this.transactionRepository.createTransaction(newTransaction)
        await this.entityRepository.saveDetailsInfluencerDb(ownerDetails?._id as string, ownerDetails?.orgId as string)
        return ownerDetails
    }



    async getAgencyMenu(
        planId: string
    ): Promise<IMenuCategory> {
        const plan = await this.planRepository.getAgencyPlan(planId)
        if(!plan) throw new CustomError("Plan not found",500)
        return plan.menu as IMenuCategory
    }

    async getClientMenu(orgId:string,client_id:string): Promise<IMenuCategory> {
        const client = await this.clientTenantRepository.getClientById(orgId,client_id)
        if(!client || !client.menu)throw new CustomError("Client menu not found",500)
        return client?.menu
    }


    async getOwner(
        orgId: string
    ): Promise<IAgencyTenant[]> {
        const tenantDb = await connectTenantDB(orgId)
        const ownerDetailModel = tenantDb.model('OwnerDetail', ownerDetailsSchema);
        return await this.entityRepository.fetchOwnerDetails(ownerDetailModel)
    }

    async saveContent(
        orgId:string,
        platform:string,
        platforms:IPlatforms[],
        user_id:string,
        files:IFiles[],
        metadata:IMetadata,
        contentType:string
    ):Promise<IReviewBucket>{
        let detials;
        if(platform == "agency"){
            const ownerDetials = await this.agencyTenantRepository.getOwners(orgId)
            detials = {
                user_id : ownerDetials![0]._id as string,
                orgId,files,platforms,title:metadata.title,
                caption:metadata.caption,tags:metadata.tags,
                metaAccountId: metadata.metaAccountId,contentType
                }
        }else if(platform == "client" ){
            detials = {
                user_id,orgId,files,platforms,title:metadata.title,
                caption:metadata.caption,tags:metadata.tags,
                metaAccountId: metadata.metaAccountId,contentType
                }
        }else if(platform == "influencer" ){
            detials = {
                user_id,orgId,files,platforms,title:metadata.title,
                caption:metadata.caption,tags:metadata.tags,
                metaAccountId: metadata.metaAccountId,contentType
                }
        }else{
            detials = {
                user_id,orgId,files,platforms,title:metadata.title,
                caption:metadata.caption,tags:metadata.tags,
                metaAccountId: metadata.metaAccountId,contentType
                }
        }
       return this.contentRepository.saveContent(detials)
    }


    async getS3ViewUrl(
        key:string
    ):Promise<string>{
        return await getS3ViewUrl(key)
    }

    async fetchContents(
        orgId: string,
        user_id: string
    ): Promise<IReviewBucket[] >{
        const contents = await this.contentRepository.getContentsByUserId(orgId, user_id)
        if(!contents || contents.length == 0)throw new CustomError("Contents not found",500)
        return contents
    }

}


