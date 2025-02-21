import { clientSchema, IClient } from "../../models/agency/client.model";
import { IAgency, IAgencyOwner } from "../../shared/types/agency.types";
import { createClientMailData } from "../../shared/utils/mail.datas";
import bcrypt from 'bcrypt'
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ConflictError, CustomError, generatePassword, hashPassword, NotFoundError, sendMail, UnauthorizedError } from "mern.common";
import { ownerDetailsSchema } from "../../models/agency/agency.model";
import { createNewMenuForClient } from "../../shared/utils/menu.utils";
import { connectTenantDB } from "../../config/db";
import { ReviewBucketSchema } from "../../models/agency/review-bucket.model";
import { uploadToS3 } from "../../shared/utils/aws";
import { AWS_S3_BUCKET_NAME } from "../../config/env";
import { projectSchema } from "../../models/agency/project.model";
import { createClientDTO } from "../../dto/client";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { IProjectRepository } from "../../repositories/Interface/IProjectRepository";
import { IClientTenantRepository } from "../../repositories/Interface/IClientTenantRepository";

@injectable()
export default class AgencyService implements IAgencyService {
    private agencyRepository: IAgencyRepository;
    private clientRepository: IClientRepository;
    private clientTenantRepository: IClientTenantRepository;
    private projectRepository: IProjectRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository: IAgencyRepository,
        @inject('ClientRepository') clientRepository: IClientRepository,
        @inject('ClientTenatRepository') clientTenantRepository: IClientTenantRepository,
        @inject('ProjectRepository') projectRepository: IProjectRepository,

    ) {
        this.agencyRepository = agencyRepository,
        this.clientRepository = clientRepository,
        this.clientTenantRepository = clientTenantRepository,
        this.projectRepository = projectRepository
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


    async verifyOwner(
        agency_id: string
    ): Promise<IAgency | null> {
        return await this.agencyRepository.findAgencyWithId(agency_id)
    }


    async createClient(
        newClientDetials:createClientDTO
    ): Promise<IClient | void> {

        const client = await this.clientRepository.findClientWithMail(newClientDetials.email)
        if (client && client.orgId == newClientDetials.orgId) throw new ConflictError('Client already exists with this email')
        const Agency = await this.agencyRepository.findAgencyWithOrgId(newClientDetials.orgId)
        if (!Agency) throw new NotFoundError("Agency not found , Please try again")
        if (Agency.remainingClients == 0) throw new CustomError("Client creation limit reached ,Please upgrade for more clients", 402)

        let password = await generatePassword(newClientDetials.name)
        const HashedPassword = await hashPassword(password)

        const clientDetails = {
            orgId:newClientDetials.orgId, name:newClientDetials.name, email:newClientDetials.email,
            industry:newClientDetials.industry, socialMedia_credentials:newClientDetials.socialMedia_credentials,
            password: HashedPassword
        }
        let newMenu = createNewMenuForClient(newClientDetials.menu)

        const createdClient:any = await this.clientTenantRepository.createClient(newClientDetials.orgId, { ...clientDetails, menu: newMenu })

        for(let item in newClientDetials.services){
            const { serviceName, serviceDetails } = newClientDetials.services[item];  
            const { deadline, ...details } = serviceDetails; 
            await this.projectRepository.createProject(createdClient.orgId,createdClient._id,createdClient.name,serviceName,details,item,new Date(deadline))
        }
        
        
        if (createdClient) await this.clientRepository.createClient(clientDetails)
        const data = createClientMailData(newClientDetials.email, newClientDetials.name.charAt(0).toUpperCase() + newClientDetials.name.slice(1).toLowerCase(),newClientDetials.organizationName, password)
        sendMail(
            newClientDetials.email,
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

    async saveAgencySocialMediaTokens(orgId: string, Provider: string, token: string, tenantDb: any): Promise<any> {
        try {
            const db = await tenantDb.model('ownerDetails', ownerDetailsSchema)
            return await this.agencyRepository.setSocialMediaTokens(orgId, Provider, token, db)
        } catch (error) {

        }
    }

    async getAllClients(orgId: string): Promise<any> {
        const db = await connectTenantDB(orgId)
        return await this.agencyRepository.getAllClients(db)
    }

    async getClient(db: any, id: string): Promise<any> {
        return await this.agencyRepository.getClientById(db, id)

    }
    async saveContentToDb(id: string, orgId: string, tenantDb: any, files: any, platforms: any, contentType: string, caption: string): Promise<any> {
        let contentUrls = [];
        for (let file of files) {
            const fileObject = new File([file.buffer], file.originalname.toLowerCase(), { type: file.mimetype });
            const contentUrl = await uploadToS3(fileObject, `test/${file.originalname.toLowerCase()}`, AWS_S3_BUCKET_NAME);
            contentUrls.push(contentUrl);
        }

        const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
        const details = { url: contentUrls, platforms, contentType, id, orgId, caption }
        return await this.agencyRepository.saveContentToDb(db, details)
    }


    async getContent(tenantDb: any, contentId: any): Promise<any> {
        const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
        return await this.agencyRepository.getContentById(contentId, db)

    }

    async changeContentStatus(tenantDb: any, contentId: string, status: string): Promise<any> {
        const db = await tenantDb.model('reviewBucket', ReviewBucketSchema)
        return await this.agencyRepository.changeContentStatusById(contentId, db, status)
    }

    async getAvailableUsers(tenantDb:any):Promise<any>{
        const clientModel = await tenantDb.model('client', clientSchema)
        return await this.agencyRepository.fetchAllAvailableUsers(clientModel)
    }

    async  getProjectsCount(tenantDb:any):Promise<any>{
        const projectModel = await tenantDb.model('project', projectSchema)
        const projects = await this.agencyRepository.getProjectsCount(projectModel)
        const weaklyProjects = projects.filter((project:any)=>new Date(project.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
            count:projects.length || 0,
            lastWeekCount:weaklyProjects.length || 0
        }
    }   

    async getClientsCount(tenantDb:any):Promise<any>{
        const clientModel = await tenantDb.model('client', clientSchema)
        const clients = await this.agencyRepository.getClientsCount(clientModel)
        const weaklyClients = clients.filter((client:any)=>new Date(client.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        return {
            count:clients.length || 0,
            lastWeekCount:weaklyClients.length || 0
        }
    }

    async editProjectStatus(tenantDb:any,projectId:string,status:string):Promise<any>{
        const projectModel = await tenantDb.model('project', projectSchema)
        return await this.agencyRepository.editProjectStatus(projectModel,projectId,status)
    }


}



