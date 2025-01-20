import { IClient } from "../../models/agency/clientModel";
import { IAgencyOwner } from "../../shared/types/agencyTypes";
import { createClientMailData } from "../../shared/utils/mail.datas";
import bcrypt from 'bcrypt'
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ConflictError, CustomError, generatePassword, hashPassword, NotFoundError, sendMail, UnauthorizedError } from "mern.common";

@injectable()
export default class AgencyService implements IAgencyService {
    private agencyRepository: IAgencyRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository: IAgencyRepository
    ) {
        this.agencyRepository = agencyRepository
    }

    async agencyLoginHandler(email: string, password: string): Promise<IAgencyOwner | null> {
        try {
            const ownerDetails = await this.agencyRepository.findAgencyWithMail(email);
            if (!ownerDetails) throw new NotFoundError('User not found');
            if (ownerDetails.isBlocked) throw new UnauthorizedError('Account is blocked');
    
            const isValid = await bcrypt.compare(password, ownerDetails.password);
            if (!isValid) throw new CustomError('Invalid credentials', 401);
            return ownerDetails;
            
        } catch (error) {
            throw error
        }
    }


    async verifyOwner(email: string): Promise<IAgencyOwner | null> {
        return await this.agencyRepository.findAgencyWithMail(email)
    }




    async createClient(clientModel: any, orgId: string, name: string, email: string, industry: string, socialMedia_credentials: any): Promise<IClient | void> {

        const client = await this.agencyRepository.isClientExists(email)
        if (client && client.orgId == orgId) throw new ConflictError('Client already exists with this email')
        const Agency = await this.agencyRepository.findAgencyWithOrgId(orgId)
        if (!Agency) throw new NotFoundError("Agency not found , Please try again")
        if (Agency.remainingClients == 0) throw new CustomError("Client creation limit reached ,Please upgrade for more clients", 402)

        let password = await generatePassword(name)
        const HashedPassword = await hashPassword(password)
        const newClient = {
            orgId, name, email,
            industry, socialMedia_credentials,
            password: HashedPassword
        }

        const createdClient = await this.agencyRepository.createClient(clientModel, newClient)
        if (createdClient) await this.agencyRepository.saveClientToMainDB(newClient)
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

}

