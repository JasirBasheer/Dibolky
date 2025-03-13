import { inject, injectable } from 'tsyringe';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { ownerDetailsSchema } from '../../models/agency.model';
import { ITransactionRepository } from '../../repositories/Interface/ITransactionRepository';
import { IPlan } from '../../types/admin.types';
import { IProject } from '../../models/project.model';
import { IProjectRepository } from '../../repositories/Interface/IProjectRepository';
import { IClientTenantRepository } from '../../repositories/Interface/IClientTenantRepository';
import { IContentRepository } from '../../repositories/Interface/IContentRepository';
import { IAgencyTenantRepository } from '../../repositories/Interface/IAgencyTenantRepository';
import { AddressType, IAgency, IAgencyTenant } from '../../types/agency.types';
import { IInfluencer } from '../../types/influencer.types';
import { connectTenantDB } from '../../config/db.config';
import { IFiles, IIntegratePaymentType, IMenuCategory, IMetadata, IPlatforms, IBucket, IUpdateProfile } from '../../types/common.types';
import { IClientTenant } from '../../types/client.types';
import { IAgencyRepository } from '../../repositories/Interface/IAgencyRepository';
import { IClientRepository } from '../../repositories/Interface/IClientRepository';
import { getS3ViewUrl } from '../../utils/aws.utils';
import { addMonthsToDate } from '../../utils/date-utils';
import {
    CustomError,
    hashPassword,
} from 'mern.common';
import { getMetaAccessTokenStatus } from '../../provider.strategies/facebook.strategy';

@injectable()
export default class EntityService implements IEntityService {
    private entityRepository: IEntityRepository;
    private planRepository: IPlanRepository;
    private transactionRepository: ITransactionRepository;
    private projectRepository: IProjectRepository;
    private clientTenantRepository: IClientTenantRepository;
    private clientRepository: IClientRepository;
    private contentRepository: IContentRepository;
    private agencyTenantRepository: IAgencyTenantRepository;
    private agencyRepository: IAgencyRepository;
    private contentRepositry: IContentRepository

    constructor(
        @inject('EntityRepository') entityRepository: IEntityRepository,
        @inject('PlanRepository') planRepository: IPlanRepository,
        @inject('TransactionRepository') transactionRepository: ITransactionRepository,
        @inject('ProjectRepository') projectRepository: IProjectRepository,
        @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ClientRepository') clientRepository: IClientRepository,
        @inject('ContentRepository') contentRepository: IContentRepository,
        @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
        @inject('AgencyRepository') agencyRepository: IAgencyRepository,
        @inject('ContentRepository') contentRepositry: IContentRepository,

    ) {
        this.entityRepository = entityRepository
        this.planRepository = planRepository
        this.transactionRepository = transactionRepository
        this.projectRepository = projectRepository
        this.clientTenantRepository = clientTenantRepository
        this.clientRepository = clientRepository
        this.contentRepository = contentRepository
        this.agencyTenantRepository = agencyTenantRepository
        this.agencyRepository = agencyRepository
        this.contentRepositry = contentRepositry
    }


    async getAllPlans()
        : Promise<Record<string, IPlan[]>> {
        let agencyPlans = await this.planRepository.getAgencyPlans()
        let influencerPlans = await this.planRepository.getInfluencerPlans()
        return {
            Agency: agencyPlans || [],
            Influencer: influencerPlans || []
        }
    }

    async getPlan(plans: Record<string, IPlan[]>, plan_id: string, platform: string): Promise<Partial<IPlan>> {
        const plan = plans[platform].find((elem) => elem._id as string == plan_id.toString());
        if (!plan) throw new CustomError("Plan not found", 500)
        return plan
    }

    async fetchAllProjects(orgId: string, page?: number): Promise<{ projects: IProject[], totalPages: number } | null> {
        return await this.projectRepository.fetchAllProjects(orgId, page)
    }


    async IsMailExists(
        mail: string,
        platform: string
    ): Promise<boolean | null> {
        if (platform == "Agency") {
            const isExists = await this.entityRepository.isAgencyMailExists(mail)
            if (isExists) return true
            return false
        } else if (platform == "Influencer") {
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
            main_id: ownerDetails?._id, orgId,
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
        if (!plan) throw new CustomError("Plan not found", 500)
        return plan.menu as IMenuCategory
    }

    async getClientMenu(orgId: string, client_id: string): Promise<IMenuCategory> {
        const client = await this.clientTenantRepository.getClientById(orgId, client_id)
        if (!client || !client.menu) throw new CustomError("Client menu not found", 500)
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
        orgId: string,
        platform: string,
        platforms: IPlatforms[],
        user_id: string,
        files: IFiles[],
        metadata: IMetadata,
        contentType: string
    ): Promise<IBucket> {
        let detials;
        if (platform == "agency") {
            const ownerDetials = await this.agencyTenantRepository.getOwners(orgId)
            detials = {
                user_id: ownerDetials![0]._id as string,
                orgId, files, platforms, title: metadata.title,
                caption: metadata.caption, tags: metadata.tags,
                metaAccountId: metadata.metaAccountId, contentType
            }
        } else if (platform == "client") {
            detials = {
                user_id, orgId, files, platforms, title: metadata.title,
                caption: metadata.caption, tags: metadata.tags,
                metaAccountId: metadata.metaAccountId, contentType
            }
        } else if (platform == "influencer") {
            detials = {
                user_id, orgId, files, platforms, title: metadata.title,
                caption: metadata.caption, tags: metadata.tags,
                metaAccountId: metadata.metaAccountId, contentType
            }
        } else {
            detials = {
                user_id, orgId, files, platforms, title: metadata.title,
                caption: metadata.caption, tags: metadata.tags,
                metaAccountId: metadata.metaAccountId, contentType
            }
        }
        return this.contentRepository.saveContent(detials)
    }


    async getS3ViewUrl(
        key: string
    ): Promise<string> {
        return await getS3ViewUrl(key)
    }

    async fetchContents(
        orgId: string,
        user_id: string
    ): Promise<IBucket[]> {
        const contents = await this.contentRepository.getContentsByUserId(orgId, user_id)
        return contents ?? []
    }

    async updateProfile(
        orgId: string,
        role: string,
        requestRole: string,
        details: IUpdateProfile
    ): Promise<IAgencyTenant | IClientTenant> {
        let updatedProfile;
        if (role == "agency") {
            await this.agencyRepository.updateProfile(orgId, details)
            updatedProfile = await this.agencyTenantRepository.updateProfile(orgId, details)
        } else if (role == "client" && requestRole == "agency" || requestRole == "client") {
            await this.clientRepository.updateProfile(details)
            updatedProfile = await this.clientTenantRepository.updateProfile(orgId, details)
        }
        if (!updatedProfile) throw new CustomError("An unexpected error occured while updating profile , try again later.", 500)
        return updatedProfile
    }

    async getScheduledContent(
        orgId: string,
        user_id: string
    ): Promise<IBucket[]> {
        return await this.contentRepository.getAllScheduledContents(orgId, user_id)
    }

    async getConnections(
        orgId:string ,
        entity:string, 
        user_id:string
    ):Promise<object[]>{
        let details,connections = [];
        if(entity == "agency"){
            details = await this.agencyTenantRepository.getOwnerWithOrgId(orgId)
        }else if(entity == "agency-client"){
            details = await this.clientTenantRepository.getClientById(orgId, user_id)
        }else{
            details = await this.clientTenantRepository.getClientById(orgId, user_id)
        }
        if(details!.socialMedia_credentials?.facebook?.accessToken !=""){
            let 
                status = await getMetaAccessTokenStatus(details!.socialMedia_credentials?.facebook?.accessToken as string)
         
            connections.push(
                {platform:"facebook",
                is_valid:status,
                createdAt:details?.socialMedia_credentials?.facebook!.connectedAt
                }
            )
        }

        if(details!.socialMedia_credentials?.instagram?.accessToken !=""){
            const status = await getMetaAccessTokenStatus(details!.socialMedia_credentials?.instagram?.accessToken as string)
            connections.push(
                {platform:"instagram",
                is_valid:status,
                createdAt:details?.socialMedia_credentials?.instagram!.connectedAt
                }
            )
        }

        return connections       
    }



}


