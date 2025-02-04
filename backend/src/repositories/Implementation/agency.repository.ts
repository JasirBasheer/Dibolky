import Client, { clientSchema, IClient } from '../../models/agency/clientModel'
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
            const newClient = new clientModel(details)
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

    async setSocialMediaTokens(orgId:string,Provider:string,token:string,db:any): Promise<any>{
        const details = await db.findOne({orgId:orgId})
        await details.setSocialMediaToken(Provider, token);
        
        console.log(details)
    }

    async getAllClients(db:any): Promise<any>{
        const ClientModel = db.model('clients',clientSchema);
        return await ClientModel.find({});
    }

    async getClientById(db:any,id:string): Promise<any>{
        const ClientModel = db.model('clients',clientSchema);
        return await ClientModel.findOne({_id:id});
    }

    async saveContentToDb(ReviewBucket:any,details:any): Promise<any>{
            console.log(details)
        const newReviewBucket = new ReviewBucket(details)
        return await newReviewBucket.save()

    }


    async getContentById(contentId:string,db:any):Promise<any>{
        return await db.findOne({_id:contentId})
    }

    async changeContentStatusById(contentId:string,db:any,status:string):Promise<any>{
         await db.findByIdAndUpdate(contentId, { status: status })
         console.log('done')
         return "hellow" 
        
    }



}

