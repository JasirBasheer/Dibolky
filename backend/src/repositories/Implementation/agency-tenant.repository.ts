import mongoose, { Model, Schema } from "mongoose";
import { BaseRepository, NotFoundError } from "mern.common";
import { inject, injectable } from "tsyringe";
import { connectTenantDB } from "../../config/db";
import { IAgency, IOwnerDetailsSchema } from "../../shared/types/agency.types";
import { IAgencyTenantRepository } from "../Interface/IAgencyTenantRepository";

@injectable()
export default class AgencyTenantRepository extends BaseRepository<IOwnerDetailsSchema> implements IAgencyTenantRepository {
    private chatSchema: Schema;
    private modelName = 'ownerdetails';
    private models: Map<string, Model<IOwnerDetailsSchema>> = new Map();

    constructor(
        @inject('agency_tenant_model') schema: Schema
    ) {
        super(null as any);
        this.chatSchema = schema;
    }


    private async getModel(
        orgId: string
    ): Promise<Model<IOwnerDetailsSchema>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IOwnerDetailsSchema> = connection.model<IOwnerDetailsSchema>(this.modelName, this.chatSchema);
        this.models.set(orgId, model);
        return model;
    }

    async setSocialMediaTokens(
        orgId: string,
        provider: string,
        token: string
    ): Promise<void> {
        const model = await this.getModel(orgId);

        const details = await model.find({})
        if (!details) throw new NotFoundError('Agency not found')
        const agency = details[0]
        return await agency.setSocialMediaToken!(provider, token);
    }


    async getOwners(
        orgId: string, 
    ): Promise<IOwnerDetailsSchema[] | null> {
        const model = await this.getModel(orgId);

        const owners = await model.find({})
        if (!owners) throw new NotFoundError('Agency owners not found')
        return owners
    }

}
