import { IClient } from "../../models/agency/clientModel";
import { IAgencyOwner } from "../../shared/types/agencyTypes";
import { CustomError } from "../../shared/utils/CustomError";
import { createClientMailData, sendMail } from "../../shared/utils/nodeMailer";
import { createPassword, hashPassword } from "../../shared/utils/passwordUtils";
import bcrypt from 'bcrypt'
import { IAgencyService } from "../Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";

@injectable()
export default class AgencyService implements IAgencyService {
    private agencyRepository: IAgencyRepository;

    constructor(
        @inject('IAgencyRepository') agencyRepository: IAgencyRepository
    ) {
        this.agencyRepository = agencyRepository
    }

    async agencyLoginHandler(email: string, password: string): Promise<IAgencyOwner | null> {
        const ownerDetails = await this.agencyRepository.findAgencyWithMail(email);
        if (!ownerDetails) throw new CustomError('User not found', 404);
        if (ownerDetails.isBlocked) throw new CustomError('Account is blocked', 403);

        const isValid = await bcrypt.compare(password, ownerDetails.password);
        if (!isValid) throw new CustomError('Invalid credentials', 401);
        return ownerDetails;
    }


    async verifyOwner(email: string): Promise<IAgencyOwner | null> {
        return await this.agencyRepository.findAgencyWithMail(email)
    }




    async createClient(clientModel: any, orgId: string, name: string, email: string, industry: string, socialMedia_credentials: any): Promise<IClient | void> {

        const client = await this.agencyRepository.isClientExists(email)
        if (client && client.orgId == orgId) throw new CustomError('Client already exists with this email', 409)
        const Agency = await this.agencyRepository.findAgencyWithOrgId(orgId)
        if (!Agency) throw new CustomError("Agency not found , Please try again", 404)
        if (Agency.remainingClients == 0) throw new CustomError("Client creation limit reached ,Please upgrade for more clients", 402)

        let password = await createPassword(name)
        const HashedPassword = await hashPassword(password)
        const newClient = {
            orgId, name, email,
            industry, socialMedia_credentials,
            password: HashedPassword
        }

        const createdClient = await this.agencyRepository.createClient(clientModel, newClient)
        if (createdClient) await this.agencyRepository.saveClientToMainDB(newClient)
        const data = createClientMailData(email, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), password)
        sendMail(email, `Welcome to ${Agency.organizationName}! Excited to Partner with You`, data)
        return createdClient
    }

}

