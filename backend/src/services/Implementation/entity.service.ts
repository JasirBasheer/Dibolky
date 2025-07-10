import { inject, injectable } from 'tsyringe';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { agencyTenantSchema } from '../../models/agency';
import { ITransactionRepository } from '../../repositories/Interface/ITransactionRepository';
import { IPlan } from '../../types/admin';
import { IProject } from '../../models/project';
import { IProjectRepository } from '../../repositories/Interface/IProjectRepository';
import { IClientTenantRepository } from '../../repositories/Interface/IClientTenantRepository';
import { IContentRepository } from '../../repositories/Interface/IContentRepository';
import { IAgencyTenantRepository } from '../../repositories/Interface/IAgencyTenantRepository';
import { AddressType, IAgency, IAgencyRegistrationPayload, IAgencyTenant, } from '../../types/agency';
import { connectTenantDB } from '../../config/db.config';
import { IFiles, IIntegratePaymentType, IMenuCategory, IMetadata, IPlatforms, IBucket, IUpdateProfile } from '../../types/common';
import { IClientTenant } from '../../types/client';
import { IAgencyRepository } from '../../repositories/Interface/IAgencyRepository';
import { IClientRepository } from '../../repositories/Interface/IClientRepository';
import { getS3ViewUrl } from '../../utils/aws.utils';
import { addMonthsToDate } from '../../utils/date-utils';
import {
    CustomError,
    hashPassword,
    NotFoundError,
} from 'mern.common';
import { getMetaAccessTokenStatus } from '../../provider-strategies/facebook';
import { INoteRepository } from '../../repositories/Interface/INoteRepository';
import { getLinkedInTokenStatus } from '@/provider-strategies/linkedin';
import { isXAccessTokenValid } from '@/provider-strategies/x';

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
    private noteRepository: INoteRepository;

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
        @inject('NoteRepository') noteRepository: INoteRepository,

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
        this.noteRepository = noteRepository
    }


  

    async fetchAllProjects(orgId: string, page?: number): Promise<{ projects: IProject[], totalPages: number } | null> {
        return await this.projectRepository.fetchAllProjects(orgId, page)
    }


    async IsMailExists(
        mail: string,
    ): Promise<boolean> {
            const isExists = await this.entityRepository.isAgencyMailExists(mail)
            if (isExists) return true
            return false
    }


    async createAgency(payload: IAgencyRegistrationPayload): Promise<Partial<IAgency> | null> {
        const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, transactionId, paymentGateway, description, currency } = payload;

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




    async getMenu(
        planId: string
    ): Promise<IMenuCategory> {
        const plan = await this.planRepository.getPlan(planId)
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
        const ownerDetailModel = tenantDb.model('OwnerDetail', agencyTenantSchema);
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
        const contents = await this.contentRepository.getContentsByUserId(orgId, user_id) ?? []
        const contentIds = contents.map((content) => String(content._id));
        const notes = await this.noteRepository.getContentNotesByEntityIds(orgId,contentIds)

        return contents.map((content) => {
            const matchingNote = notes.find(
              (note) => note.entityId.toString() === String(content._id)
            );
            return {
              ...content.toObject(),
              reason: matchingNote ? matchingNote : null,
            };
          });
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
        if(!details)throw new NotFoundError('User details not found please try again later..')
        if(details.socialMedia_credentials?.facebook?.accessToken && details.socialMedia_credentials?.facebook?.accessToken !=""){
            const status = await getMetaAccessTokenStatus(details!.socialMedia_credentials?.facebook?.accessToken as string)
            connections.push(
                {platform:"facebook",
                is_valid:status,
                createdAt:details?.socialMedia_credentials?.facebook!.connectedAt
                }
            )
        }


        if(details.socialMedia_credentials?.instagram?.accessToken && details.socialMedia_credentials?.instagram?.accessToken !=""){
            const status = await getMetaAccessTokenStatus(details!.socialMedia_credentials?.instagram?.accessToken as string)
            connections.push(
                {platform:"instagram",
                is_valid:status,
                createdAt:details?.socialMedia_credentials?.instagram!.connectedAt
                }
            )
        }

          if(details.socialMedia_credentials?.linkedin?.accessToken && details.socialMedia_credentials?.linkedin?.accessToken !=""){
            const status = await getLinkedInTokenStatus(details!.socialMedia_credentials?.linkedin?.accessToken as string)
            connections.push(
                {platform:"linkedin",
                is_valid:status,
                createdAt:details?.socialMedia_credentials?.linkedin!.connectedAt
                }
            )
        }

         if(details.socialMedia_credentials?.x?.accessToken && details.socialMedia_credentials?.x?.accessToken !=""){
            const status = await isXAccessTokenValid(details!.socialMedia_credentials?.x?.accessToken as string)
            connections.push(
                {platform:"x",
                is_valid:status,
                createdAt:details?.socialMedia_credentials?.x!.connectedAt
                }
            )
        }
        console.log(connections,'connectionsssssss')
        return connections       
    }



}


