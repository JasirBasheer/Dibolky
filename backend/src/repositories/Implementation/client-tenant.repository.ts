import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository } from "mern.common";
import { IClientTenantRepository } from "../Interface/IClientTenantRepository";
import { IClientTenant, User } from "../../shared/types/client.types";
import { connectTenantDB } from "../../config/db";
import { NotFoundError } from "rxjs";



@injectable()
export class ClientTenantRepository extends BaseRepository<IClientTenant> implements IClientTenantRepository {
    private clientSchema: Schema;
    private modelName = 'client';
    private models: Map<string, Model<IClientTenant>> = new Map();

    constructor(
        @inject('client_tenant_model') schema: Schema
    ) {
        super(null as any);
        this.clientSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<IClientTenant>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');
        let model: Model<IClientTenant> = connection.model<IClientTenant>(this.modelName, this.clientSchema);
        this.models.set(orgId, model);
        return model;
    }

    async createClient(
        orgId: string,
        details: any
    ): Promise<IClientTenant | void> {
        const model = await this.getModel(orgId);

        const newClient = new model(details)
        return await newClient.save()
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
    async setSocialMediaUserNames(
        orgId: string,
        client_id: string,
        provider: string,
        username: string
    ): Promise<void> {
        const model = await this.getModel(orgId);

        const details = await model.findOne({ _id: client_id })
        if (!details) throw new NotFoundError('Client not found')
        return await details.setSocialMediaUserName!(provider, username);
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



}
