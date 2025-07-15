import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { IClientTenantRepository } from "../Interface/IClientTenantRepository";
import { IClientTenantType, User } from "../../types/client";
import { connectTenantDB } from "../../config/db.config";
import { IUpdateProfile } from "../../types/common";
import { IClientTenant } from "@/models/Interface/client-tenant";



@injectable()
export class ClientTenantRepository extends BaseRepository<IClientTenant> implements IClientTenantRepository {
    private _clientSchema: Schema;
    private _modelName = 'client';
    private _models: Map<string, Model<IClientTenant>> = new Map();

    constructor(
        @inject('client_tenant_model') schema: Schema
    ) {
        super(null as unknown as Model<IClientTenant>);
        this._clientSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<IClientTenant>> {
        if (this._models.has(orgId)) {
            return this._models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');
        let model: Model<IClientTenant> = connection.model<IClientTenant>(this._modelName, this._clientSchema);
        this._models.set(orgId, model);
        return model;
    }

    async createClient(
        orgId: string,
        details: Partial<IClientTenantType>
    ): Promise<IClientTenant> {
        const model = await this.getModel(orgId);

        const newClient = new model(details)
        const createdClient = await newClient.save()
        if(!createdClient)throw new CustomError("An unexpected error occured while creating client please try again later.",500)
        return createdClient
    }

    async getAllClients(
        orgId: string
    ): Promise<IClientTenant[]> {
        const model = await this.getModel(orgId);
        return await model.find({})
    }

    async getClientById(
        orgId: string,
        client_id: string
    ): Promise<IClientTenant | null> {
        const model = await this.getModel(orgId);
        return await model.findById(client_id)
    }

    async setSocialMediaTokens(
        orgId: string,
        client_id: string,
        provider: string,
        token: string
    ): Promise<void> {
        const model = await this.getModel(orgId);

        const details = await model.findOne({ _id: client_id })
        if (!details) throw new NotFoundError('Client not found')
        return await details.setSocialMediaToken!(provider, token);
    }
 

    async getClientDetailsByMail(
        orgId: string,
        email: string
    ): Promise<IClientTenant | null> {
        const model = await this.getModel(orgId);
        return await model.findOne({ email: email })
    }

    async getOwnerDetails(orgId: string): Promise<IClientTenant[] | null> {
        const model = await this.getModel(orgId);

        return await model.find({}, {
            orgId: 0,
            'socialMedia_credentials': 0,
        });
    }

    async updateProfile(
        orgId:string,
        details:IUpdateProfile
    ): Promise<IClientTenant | null>{
        const model = await this.getModel(orgId);
        
        return await model.findOneAndUpdate(
            { _id: details.tenant_id },
            {
                profile: details.profile,
                name: details.name,
                bio: details.bio
            },
            { new: true }
        )
    }



}
