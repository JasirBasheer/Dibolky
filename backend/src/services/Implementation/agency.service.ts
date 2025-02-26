import { IAgency, IOwnerDetailsSchema, IReviewBucket } from "../../shared/types/agency.types";
import { createClientMailData } from "../../shared/utils/mail.datas";
import bcrypt from 'bcrypt'
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ConflictError, CustomError, generatePassword, hashPassword, NotFoundError, sendMail, UnauthorizedError } from "mern.common";
import { createNewMenuForClient } from "../../shared/utils/menu.utils";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IProjectRepository } from "../../repositories/Interface/IProjectRepository";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IClient, IClientTenant } from "../../shared/types/client.types";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";

@injectable()
export default class AgencyService implements IAgencyService {
    private agencyRepository: IAgencyRepository;
    private agencyTenantRepository: IAgencyTenantRepository;
    private clientRepository: IClientRepository;
    private clientTenantRepository: IClientTenantRepository;
    private projectRepository: IProjectRepository;
    private contentRepository: IContentRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository: IAgencyRepository,
        @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
        @inject('ClientRepository') clientRepository: IClientRepository,
        @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ProjectRepository') projectRepository: IProjectRepository,
        @inject('ContentRepository') contentRepository: IContentRepository,

    ) {
        this.agencyRepository = agencyRepository,
            this.agencyTenantRepository = agencyTenantRepository
        this.clientRepository = clientRepository,
            this.clientTenantRepository = clientTenantRepository,
            this.projectRepository = projectRepository
        this.contentRepository = contentRepository
    }

    async agencyLoginHandler(
        email: string,
        password: string
    ): Promise<string> {
        try {
            const ownerDetails = await this.agencyRepository.findAgencyWithMail(email);
            if (!ownerDetails) throw new NotFoundError('User not found');
            if (ownerDetails.isBlocked) throw new UnauthorizedError('Account is blocked');

            const isValid = await bcrypt.compare(password, ownerDetails.password!);
            if (!isValid) throw new UnauthorizedError('Invalid credentials');
            return ownerDetails?._id as string;

        } catch (error) {
            throw error
        }
    }

    async getProjectsCount(
        orgId: string
    ): Promise<object> {
        const projects = await this.projectRepository.fetchAllProjects(orgId)
        const weaklyProjects = projects?.filter((project: any) => new Date(project.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
            count: projects?.length || 0,
            lastWeekCount: weaklyProjects?.length || 0
        }
    }

    async getClientsCount(
        orgId: string
    ): Promise<object> {
        const clients = await this.clientTenantRepository.getAllClients(orgId)
        const weaklyClients = clients.filter((client: any) => new Date(client.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
            count: clients.length || 0,
            lastWeekCount: weaklyClients.length || 0
        }
    }


    async getAllAvailableClients(
        orgId: string
    ): Promise<IClientTenant[]> {
        return await this.clientTenantRepository.getAllClients(orgId)
    }


    async verifyOwner(
        agency_id: string
    ): Promise<IAgency | null> {
        return await this.agencyRepository.findAgencyWithId(agency_id)
    }


    async getAgencyOwnerDetails(
        orgId: string
    ): Promise<IOwnerDetailsSchema | null> {
        let AgencyOwners =  await this.agencyTenantRepository.getOwners(orgId)
        if(!AgencyOwners)throw new NotFoundError("Agency not found , Please try again")
        return AgencyOwners[0] 
    }
    
    async createClient(
        orgId: string,
        name: string,
        email: string,
        industry: string,
        services: any,
        menu: string[],
        organizationName: string
    ): Promise<IClient | void> {
        const client = await this.clientRepository.findClientWithMail(email)
        if (client && client.orgId == orgId) throw new ConflictError('Client already exists with this email')
        const Agency = await this.agencyRepository.findAgencyWithOrgId(orgId)
        if (!Agency) throw new NotFoundError("Agency not found , Please try again")
        if (Agency.remainingClients == 0) throw new CustomError("Client creation limit reached ,Please upgrade for more clients", 402)

        let password = await generatePassword(name)
        const HashedPassword = await hashPassword(password)

        const clientDetails = {
            orgId: orgId, name: name, email: email,
            industry: industry,
            password: HashedPassword
        }
        let newMenu = createNewMenuForClient(menu)

        const createdClient: any = await this.clientTenantRepository.createClient(orgId, { ...clientDetails, menu: newMenu })

        for (let item in services) {
            const { serviceName, serviceDetails } = services[item];
            const { deadline, ...details } = serviceDetails;
            await this.projectRepository.createProject(createdClient.orgId, createdClient._id, createdClient.name, serviceName, details, item, new Date(deadline))
        }


        if (createdClient) {
            const c = await this.clientRepository.createClient(clientDetails)
            console.log("client created in main db", c)
        }
        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), organizationName, password)
        sendMail(
            email,
            `Welcome to ${Agency.organizationName}! Excited to Partner with You`,
            data,
            (error: any, info: any) => {
                if (error) {
                    console.error("Failed to send email:", error);
                } else {
                    console.log("Email sent successfully:", info.response);
                }
            }
        );
        return createdClient
    }


    async saveAgencySocialMediaTokens(
        orgId: string,
        provider: string,
        token: string,
    ): Promise<any> {
        return await this.agencyTenantRepository.setSocialMediaTokens(orgId, provider, token)
    }

    async getAllClients(
        orgId: string
    ): Promise<IClientTenant[] | null> {
        return await this.clientTenantRepository.getAllClients(orgId)
    }

    async getClient(
        orgId: string,
        client_id: string
    ): Promise<IClientTenant | null> {
        return await this.clientTenantRepository.getClientById(orgId, client_id)
    }


    async saveContentToDb(
        client_id: string,
        orgId: string,
        files: any,
        platforms: any,
        contentType: string,
        caption: string
    ): Promise<IReviewBucket | null> {
        const details = { files, platforms, contentType, client_id, orgId, caption }
        return await this.contentRepository.saveContent(details)
    }


    async getContent(
        orgId: string,
        contentId: string
    ): Promise<IReviewBucket | null> {
        return await this.contentRepository.getContentById(orgId, contentId)

    }

    async changeContentStatus(
        orgId: string,
        contentId: string,
        status: string
    ): Promise<IReviewBucket | null> {
        return await this.contentRepository.changeContentStatus(orgId, contentId, status)
    }



    async editProjectStatus(
        orgId: string,
        projectId: string,
        status: string
    ): Promise<any> {
        return await this.projectRepository.editProjectStatus(orgId, projectId, status)
    }

    async getInitialSetUp(
        orgId: string
    ): Promise<object> {
        const owners = await this.agencyTenantRepository.getOwners(orgId)

        return {
            isSocialMediaInitialized: owners?.[0]?.isSocialMediaInitialized,
            isPaymentInitialized: owners?.[0]?.isPaymentInitialized
        }
    }

}



