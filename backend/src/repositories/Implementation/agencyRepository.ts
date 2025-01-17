import Client, { IClient } from '../../models/agency/clientModel'
import Agency from "../../models/agency/agencyModel";
import { IAgencyOwner } from '../../shared/types/agencyTypes';
import { IAgencyRepository } from '../Interface/IAgencyRepository';



export default class AgencyRepository implements IAgencyRepository {

    async findAgencyWithMail(email: string): Promise<IAgencyOwner | null> {
        return await Agency.findOne({ email: email });
    }

    async findAgencyWithId(id: string): Promise<IAgencyOwner | null> {
        return await Agency.findOne({ _id: id });
    }

    async findAgencyWithOrgId(orgId: string): Promise<IAgencyOwner | null> {
        return await Agency.findOne({ orgId: orgId })
    }

    async isClientExists(email: string): Promise<any> {
        return await Client.findOne({ email: email })
    }

    async createClient(clientModel: any, details: any): Promise<IClient | void> {
            const { orgId, name, email, socialMedia_credentials, password } = details
            const newClient = new clientModel({
                orgId,
                name, email,
                socialMedia_credentials,
                password
            })

            const createdClient = await newClient.save()
            return createdClient
    }

    async saveClientToMainDB(details: any): Promise<any> {
            const newClient = new Client(details)
            return await newClient.save()
    }

    async changePassword(id: string, password: string):Promise<any> {
            return await Agency.findOneAndUpdate(
             { _id: id },
             { $set: { password: password } },
             { new: true })
    }
}

