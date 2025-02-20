import Client from "../../models/agency/client.model";
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
    async setSocialMediaUserNames(id: string, provider: string, username: string, db: any): Promise<any> {
        const details = await db.findOne({ _id: id })
        return await details.setSocialMediaUserName(provider, username);
    }

    async getContentById(contentId: string, db: any): Promise<any> {
        return await db.findOne({ _id: contentId })
    }
    async changeContentStatusById(contentId: string, db: any, status: string): Promise<any> {
        return await db.findByIdAndUpdate(contentId, { status: status })   
    }
    async getReviewBucketById(clientId:string,db:any):Promise<any>{
        return await db.find({id:clientId})
    }

    async getClientDetailsByMail(tenantDb:any,email:string):Promise<any>{
        return await tenantDb.findOne({email:email})
    }

    async getOwnerDetails(tenantDb:any):Promise<any>{
        return await tenantDb.find({}, {
            orgId: 0,
            'socialMedia_credentials': 0,
        });
    }

    async getClientInMainDb(email:string):Promise<any>{
        return await Client.findOne({email:email})
    }



    



}

