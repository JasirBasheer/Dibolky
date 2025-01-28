import Client from "../../models/agency/clientModel";
import { IClientRepository } from "../Interface/IClientRepository";

export default class ClientRepository implements IClientRepository {

    async findClientWithMail(email: string): Promise<any> {
        return await Client.findOne({ email: email });
    }
    async findClientWithId(id: string): Promise<any> {
        return await Client.findOne({ _id: id });
    }
    async setSocialMediaTokens(id: string, provider: string, token: string, db: any): Promise<any> {
        const details = await db.findOne({ _id: id })
        return await details.setSocialMediaToken(provider, token);
    }
    async getContentById(contentId: string, db: any): Promise<any> {
        return await db.findOne({ _id: contentId })
    }
    async changeContentStatusById(contentId: string, db: any, status: string): Promise<any> {
        return await db.findByIdAndUpdate(contentId, { status: status })   
    }



}

