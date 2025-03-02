import { IAgency, IAgencyTenant } from "../../shared/types/agency.types";
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
import { IFiles, IPlatforms, IReviewBucket } from "../../shared/types/common.types";
import { IAvailableClients, ServicesData } from "../../shared/types/chat.types";
import { IProject } from "../../models/agency/project.model";

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
        const weaklyProjects = projects?.filter((project: IProject) => new Date(project.createdAt!).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000) || []
        return {
            count: projects?.length || 0,
            lastWeekCount: weaklyProjects?.length || 0
        }
    }

    async getClientsCount(
        orgId: string
    ): Promise<object> {
        const clients = await this.clientTenantRepository.getAllClients(orgId)
        const weaklyClients = clients.filter((client:IClientTenant) => new Date(client.createdAt!).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
            count: clients.length || 0,
            lastWeekCount: weaklyClients.length || 0
        }
    }


    async getAllAvailableClients(
        orgId: string
    ): Promise<IAvailableClients[]> {
        const clients = await this.clientTenantRepository.getAllClients(orgId)
        return clients.map((client:IClientTenant)=>{
            return {
                _id:client._id as string ,
                name:client.name ?? "user",
                email:client.email ?? "user@gmail.com",
                type:"client",

            }
        }) ??[]
    }


    async verifyOwner(
        agency_id: string
    ): Promise<IAgency | null> {
        return await this.agencyRepository.findAgencyWithId(agency_id)
    }


    async getAgencyOwnerDetails(
        orgId: string
    ): Promise<IAgencyTenant | null> {
        let AgencyOwners =  await this.agencyTenantRepository.getOwners(orgId)
        if(!AgencyOwners)throw new NotFoundError("Agency not found , Please try again")
        return AgencyOwners[0] 
    }
    
    async createClient(
        orgId: string,
        name: string,
        email: string,
        industry: string,
        services: ServicesData,
        menu: string[],
        organizationName: string
    ): Promise<IClientTenant | null> {
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

        const createdClient: IClientTenant  = await this.clientTenantRepository.createClient(orgId, { ...clientDetails, menu: newMenu })

        for (let item in services) {
            const { serviceName, serviceDetails } = services[item];
            const { deadline, ...details } = serviceDetails;
            await this.projectRepository.createProject(createdClient.orgId as string, createdClient._id as string, createdClient.name as string, serviceName as string, details, item, new Date(deadline))
        }


        if (createdClient) await this.clientRepository.createClient(clientDetails as IClient)
        
        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), organizationName, password)
        sendMail(
            email,
            `Welcome to ${Agency.organizationName}! Excited to Partner with You`,
            data,
            (error: unknown, info: {response:string}) => {
                if (error) {
                    console.error("Failed to send email:", error);
                } else {
                    console.log("Email sent successfully:", info.response);
                }
            }
        );
        return createdClient
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
        files: IFiles[],
        platforms: IPlatforms[],
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
    ): Promise<IProject | null> {
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



