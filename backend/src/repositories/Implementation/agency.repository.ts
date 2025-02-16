import Client, { clientSchema, IClient } from '../../models/agency/client.model'
import Agency from "../../models/agency/agency.model";
import { IAgencyOwner } from '../../shared/types/agency.types';
import { IAgencyRepository } from '../Interface/IAgencyRepository';

interface Client {
    _id: string;
    name: string;
}

interface Employee {
    _id: string;
    name: string;
}

interface User {
    _id: string;
    name: string;
    type: 'client' | 'employee';
}


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


    

    async fetchAllAvailableUsers(clientModel: any, employeeModel: any): Promise<User[]> {
        const clients = await clientModel.find({}, { _id: 1, name: 1 }).lean()
            .then((clients: Client[]) => clients.map(client => ({
                _id: client._id,
                name: client.name,
                type: 'client' as const
            })));
            
        const employees = await employeeModel.find({}, { _id: 1, name: 1 }).lean()
            .then((employees: Employee[]) => employees.map(employee => ({
                ...employee,
                type: 'employee' as const
            })));
        
        return [...clients, ...employees];
    }



}

