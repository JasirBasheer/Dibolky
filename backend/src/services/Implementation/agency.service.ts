import { clientSchema, IClient } from "../../models/agency/clientModel";
import { IAgencyOwner } from "../../shared/types/agencyTypes";
import { createClientMailData } from "../../shared/utils/mail.datas";
import bcrypt from 'bcrypt'
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ConflictError, CustomError, generatePassword, hashPassword, NotFoundError, sendMail, UnauthorizedError } from "mern.common";
import { ownerDetailsSchema } from "../../models/agency/agencyModel";
import { createNewMenuForClient } from "../../shared/utils/menu.utils";
import { connectTenantDB } from "../../config/db";
import { ReviewBucketSchema } from "../../models/agency/reviewBucketModel";
import { uploadToS3 } from "../../shared/utils/aws";
import { AWS_S3_BUCKET_NAME } from "../../config/env";

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
        industry: string, socialMedia_credentials: any, services: any, menu: string[]
    ): Promise<IClient | void> {

        console.log(db)

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
        const createdClient = await this.agencyRepository.createClient(ClientModel, { ...clientDetails, services, menu: newMenu })
        if (createdClient) await this.agencyRepository.saveClientToMainDB(clientDetails)
        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), password)
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

}



