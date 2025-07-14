import { inject, injectable } from 'tsyringe';
import { IEntityService } from '../Interface/IEntityService';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IPlanRepository } from '../../repositories/Interface/IPlanRepository';
import { agencyTenantSchema } from '../../models/Implementation/agency';
import { ITransactionRepository } from '../../repositories/Interface/ITransactionRepository';
import { IPlanType } from '../../types/admin';
import { IProject } from '../../models/Implementation/project';
import { IProjectRepository } from '../../repositories/Interface/IProjectRepository';
import { IClientTenantRepository } from '../../repositories/Interface/IClientTenantRepository';
import { IContentRepository } from '../../repositories/Interface/IContentRepository';
import { IAgencyTenantRepository } from '../../repositories/Interface/IAgencyTenantRepository';
import { AddressType, IAgencyType, IAgencyTenant, } from '../../types/agency';
import { connectTenantDB } from '../../config/db.config';
import { IFiles, IIntegratePaymentType, IMetadata, IPlatforms, IBucket, IUpdateProfile, IMenu } from '../../types/common';
import { IAgencyRepository } from '../../repositories/Interface/IAgencyRepository';
import { IClientRepository } from '../../repositories/Interface/IClientRepository';
import { getS3ViewUrl } from '../../utils/aws.utils';
import { addMonthsToDate } from '../../utils/date-utils';
import {
    CustomError,
    hashPassword,
    NotFoundError,
} from 'mern.common';
import { INoteRepository } from '../../repositories/Interface/INoteRepository';
import { getLinkedInTokenStatus } from '@/providers/linkedin';
import { getMetaAccessTokenStatus } from '@/providers/facebook';
import { isXAccessTokenValid } from '@/providers/x';
import { IAgencyRegistrationDto } from '@/dto';
import { SaveContentDto } from '@/dto/content';
import { IClientTenant } from '@/models';

@injectable()
export default class EntityService implements IEntityService {
    private _entityRepository: IEntityRepository;
    private _planRepository: IPlanRepository;
    private _transactionRepository: ITransactionRepository;
    private _projectRepository: IProjectRepository;
    private _clientTenantRepository: IClientTenantRepository;
    private _clientRepository: IClientRepository;
    private _contentRepository: IContentRepository;
    private _agencyTenantRepository: IAgencyTenantRepository;
    private _agencyRepository: IAgencyRepository;
    private _noteRepository: INoteRepository;

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
        @inject('NoteRepository') noteRepository: INoteRepository,

    ) {
        this._entityRepository = entityRepository
        this._planRepository = planRepository
        this._transactionRepository = transactionRepository
        this._projectRepository = projectRepository
        this._clientTenantRepository = clientTenantRepository
        this._clientRepository = clientRepository
        this._contentRepository = contentRepository
        this._agencyTenantRepository = agencyTenantRepository
        this._agencyRepository = agencyRepository
        this._noteRepository = noteRepository
    }


  

    async fetchAllProjects(orgId: string, page?: number): Promise<{ projects: IProject[], totalPages: number } | null> {
        return await this._projectRepository.fetchAllProjects(orgId, page)
    }


    async IsMailExists(
        mail: string,
    ): Promise<boolean> {
            const isExists = await this._entityRepository.isAgencyMailExists(mail)
            if (isExists) return true
            return false
    }


    async createAgency(payload: IAgencyRegistrationDto): Promise<Partial<IAgencyType> | null> {
        const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, transactionId, paymentGateway, description, currency } = payload;

        const hashedPassword = await hashPassword(password)
        let orgId = organizationName.replace(/\s+/g, "") + Math.floor(Math.random() * 1000000);
        let validityInDate = addMonthsToDate(validity)

        const newAgency = {
            orgId, planId, validity: validityInDate, organizationName, name,
            email, address, websiteUrl, industry, contactNumber, logo, password: hashedPassword,
            planPurchasedRate: planPurchasedRate, currency
        };

        const ownerDetails = await this._entityRepository.createAgency(newAgency);

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

        await this._transactionRepository.createTransaction(newTransaction)
        await this._entityRepository.saveDetailsInAgencyDb(newTenantAgency, orgId as string)
        return ownerDetails
    }




    async getMenu(
        planId: string
    ): Promise<IMenu[]> {
        const plan = await this._planRepository.getPlan(planId)
        if (!plan) throw new CustomError("Plan not found", 500)
        return plan.menu as IMenu[]
    }

    async getClientMenu(orgId: string, client_id: string): Promise<IMenu[]> {
        const client = await this._clientTenantRepository.getClientById(orgId, client_id)
        if (!client || !client.menu) throw new CustomError("Client menu not found", 500)
        return client?.menu
    }


    async getOwner(
        orgId: string
    ): Promise<IAgencyTenant[]> {
        const tenantDb = await connectTenantDB(orgId)
        const ownerDetailModel = tenantDb.model('OwnerDetail', agencyTenantSchema);
        return await this._entityRepository.fetchOwnerDetails(ownerDetailModel)
    }

    async saveContent(payload: SaveContentDto): Promise<IBucket> {
        const {orgId, platform, platforms, user_id, files, metadata, contentType } = payload 
        let detials;
        if (platform == "agency") {
            const ownerDetials = await this._agencyTenantRepository.getOwners(orgId)
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
        } else {
            detials = {
                user_id, orgId, files, platforms, title: metadata.title,
                caption: metadata.caption, tags: metadata.tags,
                metaAccountId: metadata.metaAccountId, contentType
            }
        }
        return this._contentRepository.saveContent(detials)
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
        const contents = await this._contentRepository.getContentsByUserId(orgId, user_id) ?? []
        const contentIds = contents.map((content) => String(content._id));
        const notes = await this._noteRepository.getContentNotesByEntityIds(orgId,contentIds)

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
            await this._agencyRepository.updateProfile(orgId, details)
            updatedProfile = await this._agencyTenantRepository.updateProfile(orgId, details)
        } else if (role == "client" && requestRole == "agency" || requestRole == "client") {
            await this._clientRepository.updateProfile(details)
            updatedProfile = await this._clientTenantRepository.updateProfile(orgId, details)
        }
        if (!updatedProfile) throw new CustomError("An unexpected error occured while updating profile , try again later.", 500)
        return updatedProfile
    }

    async getScheduledContent(
        orgId: string,
        user_id: string
    ): Promise<IBucket[]> {
        return await this._contentRepository.getAllScheduledContents(orgId, user_id)
    }

    async getConnections(
        orgId:string ,
        entity:string, 
        user_id:string
    ):Promise<object[]>{
        let details,connections = [];
        if(entity == "agency"){
            details = await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        }else if(entity == "agency-client"){
            details = await this._clientTenantRepository.getClientById(orgId, user_id)
        }else{
            details = await this._clientTenantRepository.getClientById(orgId, user_id)
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


