import { clientSchema, IClient } from "../../models/agency/client.model";
import { IAgencyOwner } from "../../shared/types/agency.types";
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

@injectable()
export default class AgencyService implements IAgencyService {
    private agencyRepository: IAgencyRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository: IAgencyRepository
    ) {
        this.agencyRepository = agencyRepository
    }

    async agencyLoginHandler(email: string, password: string): Promise<any> {
        try {
            const ownerDetails = await this.agencyRepository.findAgencyWithMail(email);
            if (!ownerDetails) throw new NotFoundError('User not found');
            if (ownerDetails.isBlocked) throw new UnauthorizedError('Account is blocked');

            const isValid = await bcrypt.compare(password, ownerDetails.password);
            if (!isValid) throw new UnauthorizedError('Invalid credentials');
            return ownerDetails?._id;

        } catch (error) {
            throw error
        }
    }


    async verifyOwner(id: string): Promise<IAgencyOwner | null> {
        return await this.agencyRepository.findAgencyWithId(id)
    }






    async createClient(db: any, orgId: string, name: string, email: string,
        industry: string, socialMedia_credentials: any, services: any, menu: string[],
        organizationName:string
    ): Promise<IClient | void> {

        const client = await this.agencyRepository.isClientExists(email)
        if (client && client.orgId == orgId) throw new ConflictError('Client already exists with this email')
        const Agency = await this.agencyRepository.findAgencyWithOrgId(orgId)
        if (!Agency) throw new NotFoundError("Agency not found , Please try again")
        if (Agency.remainingClients == 0) throw new CustomError("Client creation limit reached ,Please upgrade for more clients", 402)

        let password = await generatePassword(name)
        const HashedPassword = await hashPassword(password)
        const clientDetails = {
            orgId, name, email,
            industry, socialMedia_credentials,
            password: HashedPassword
        }
        let newMenu = createNewMenuForClient(menu)

        const ClientModel = db.model('client', clientSchema)
        const ProjectModel = db.model('project',projectSchema)
        const createdClient:any = await this.agencyRepository.createClient(ClientModel, { ...clientDetails, menu: newMenu })

        for(let item in services){
            const { serviceName, serviceDetails } = services[item];  
            const { deadline, ...details } = serviceDetails; 
            await this.agencyRepository.createProject(ProjectModel,createdClient._id,createdClient.name,serviceName,details,item,new Date(deadline))
            console.log(services[item])
        }
        
        
        if (createdClient) await this.agencyRepository.saveClientToMainDB(clientDetails)
        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),organizationName, password)
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



