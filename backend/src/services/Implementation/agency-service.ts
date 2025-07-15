import { IAgencyType, IAgencyTenant } from "../../types/agency";
import bcrypt from 'bcryptjs'
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ConflictError, CustomError, generatePassword, hashPassword, NotFoundError, sendMail, UnauthorizedError } from "mern.common";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IProjectRepository } from "../../repositories/Interface/IProjectRepository";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";
import { IClientTenantType, IClientType } from "../../types/client";
import { IAgencyTenantRepository } from "../../repositories/Interface/IAgencyTenantRepository";
import { IContentRepository } from "../../repositories/Interface/IContentRepository";
import { IFiles, IIntegratePaymentType, IPlatforms, IBucket } from "../../types/common";
import { IAvailableClients, ServicesData } from "../../types/chat";
import { IProject } from "../../models/Implementation/project";
import { createClientMailData } from "../../utils/mail.datas";
import { AgencyMapper } from "@/mappers/agency/agency-mapper";
import { IAgency } from "@/models/Interface/agency";
import { IClientTenant } from "@/models";
import { createNewMenuForClient } from "@/utils/menu.utils";

@injectable()
export class AgencyService implements IAgencyService {
    private _agencyRepository: IAgencyRepository;
    private _agencyTenantRepository: IAgencyTenantRepository;
    private _clientRepository: IClientRepository;
    private _clientTenantRepository: IClientTenantRepository;
    private _projectRepository: IProjectRepository;
    private _contentRepository: IContentRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository: IAgencyRepository,
        @inject('AgencyTenantRepository') agencyTenantRepository: IAgencyTenantRepository,
        @inject('ClientRepository') clientRepository: IClientRepository,
        @inject('ClientTenantRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ProjectRepository') projectRepository: IProjectRepository,
        @inject('ContentRepository') contentRepository: IContentRepository,

    ) {
        this._agencyRepository = agencyRepository,
        this._agencyTenantRepository = agencyTenantRepository
        this._clientRepository = clientRepository,
        this._clientTenantRepository = clientTenantRepository,
        this._projectRepository = projectRepository
        this._contentRepository = contentRepository
    }

    async agencyLoginHandler(
        email: string,
        password: string
    ): Promise<string> {
        try {
            const ownerDetails = await this._agencyRepository.findAgencyWithMail(email);
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
        const data = await this._projectRepository.fetchAllProjects(orgId)
        const weaklyProjects = data.projects?.filter((project: IProject) => new Date(project.createdAt!).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000) || []
        return {
            count: data?.projects.length || 0,
            lastWeekCount: weaklyProjects?.length || 0
        }
    }

    async getClientsCount(
        orgId: string
    ): Promise<object> {
        const clients = await this._clientTenantRepository.getAllClients(orgId)
        const weaklyClients = clients.filter((client: IClientTenant) => new Date(client.createdAt!).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
            count: clients.length || 0,
            lastWeekCount: weaklyClients.length || 0
        }
    }


    async getAllAvailableClients(
        orgId: string
    ): Promise<IAvailableClients[]> {
        const clients = await this._clientTenantRepository.getAllClients(orgId)
        return clients.map((client: IClientTenant) => {
            return {
                _id: client._id as string,
                name: client.name ?? "user",
                email: client.email ?? "user@gmail.com",
                profile: client.profile,
                type: "client",

            }
        }) ?? []
    }


    async verifyOwner(
        agency_id: string
    ): Promise<Partial<IAgencyType> | null> {
        const AgencyDetails =  await this._agencyRepository.findAgencyWithId(agency_id)
        return AgencyMapper.AgenyDetailsMapper(AgencyDetails as IAgency)

    }


    async getAgencyOwnerDetails(
        orgId: string
    ): Promise<IAgencyTenant | null> {
        let AgencyOwners = await this._agencyTenantRepository.getOwners(orgId)
        if (!AgencyOwners) throw new NotFoundError("Agency not found , Please try again")
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
        const client = await this._clientRepository.findClientWithMail(email)
        if (client && client.orgId == orgId) throw new ConflictError('Client already exists with this email')
        const Agency = await this._agencyRepository.findAgencyWithOrgId(orgId)
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

        const mainDbCreatedClient = await this._clientRepository.createClient(clientDetails as IClientType)
        if (!mainDbCreatedClient) throw new CustomError("An unexpected error occured while creating client,Please try again later.", 500)
        const createdClient: IClientTenant = await this._clientTenantRepository.createClient(orgId, { ...clientDetails,menu: newMenu, main_id: String(mainDbCreatedClient._id) })

        for (let item in services) {
            const { serviceName, serviceDetails } = services[item];
            const { deadline, ...details } = serviceDetails;
            await this._projectRepository.createProject(createdClient.orgId as string, createdClient._id as string, createdClient.name as string, serviceName as string, details, item, new Date(deadline))
        }



        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), organizationName, password)
        sendMail(
            email,
            `Welcome to ${Agency.organizationName}! Excited to Partner with You`,
            data,
            (error: unknown, info: { response: string }) => {
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
    ): Promise<IClientTenantType[] | null> {
        const clients = await this._clientTenantRepository.getAllClients(orgId)
        return AgencyMapper.TenantClientMapper(clients)
    }

    async getClient(
        orgId: string,
        client_id: string
    ): Promise<IClientTenant | null> {
        return await this._clientTenantRepository.getClientById(orgId, client_id)
    }


    async saveContentToDb(
        client_id: string,
        orgId: string,
        files: IFiles[],
        platforms: IPlatforms[],
        contentType: string,
        caption: string
    ): Promise<IBucket | null> {
        const details = { files, platforms, contentType, client_id, orgId, caption }
        return await this._contentRepository.saveContent(details)
    }


    async getContent(
        orgId: string,
        contentId: string
    ): Promise<IBucket | null> {
        return await this._contentRepository.getContentById(orgId, contentId)

    }

    async changeContentStatus(
        orgId: string,
        contentId: string,
        status: string
    ): Promise<IBucket | null> {
        return await this._contentRepository.changeContentStatus(orgId, contentId, status)
    }



    async editProjectStatus(
        orgId: string,
        projectId: string,
        status: string
    ): Promise<IProject | null> {
        return await this._projectRepository.editProjectStatus(orgId, projectId, status)
    }

    async getInitialSetUp(
        orgId: string
    ): Promise<object> {
        const owners = await this._agencyTenantRepository.getOwners(orgId)

        return {
            isSocialMediaInitialized: owners?.[0]?.isSocialMediaInitialized,
            isPaymentInitialized: owners?.[0]?.isPaymentInitialized
        }
    }

    async integratePaymentGateWay(
        orgId: string,
        provider: string,
        details: IIntegratePaymentType
    ): Promise<IAgencyTenant> {
        const integratedDetails = await this._agencyTenantRepository.integratePaymentGateWay(orgId, provider, details)
        if (!integratedDetails) throw new CustomError("An unexpected error occured while integration paymentgatway", 500)
        return integratedDetails
    }

    async getPaymentIntegrationStatus(
        orgId: string
    ): Promise<Record<string, boolean>>{
        const owner = await this._agencyTenantRepository.getOwnerWithOrgId(orgId)
        if(!owner)throw new CustomError("An unexpected error occured while fetching owner details, please try again later",500)
        return {
            isRazorpayIntegrated :!!owner.paymentCredentials?.razorpay?.secret_id ,
            isStripeIntegrated : !!owner.paymentCredentials?.stripe?.secret_key
        }
    }

}



