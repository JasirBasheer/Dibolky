import mongoose, { Model, Schema, Types } from "mongoose";
import { BaseRepository, NotFoundError } from "mern.common";
import { inject, injectable } from "tsyringe";
import { connectTenantDB } from "../../config/db.config";
import {  IAgencyTenant } from "../../types/agency.types";
import { IAgencyTenantRepository } from "../Interface/IAgencyTenantRepository";
import { IIntegratePaymentType, IUpdateProfile } from "../../types/common.types";

@injectable()
export default class AgencyTenantRepository extends BaseRepository<IAgencyTenant> implements IAgencyTenantRepository {
    private chatSchema: Schema;
    private modelName = 'ownerdetails';
    private models: Map<string, Model<IAgencyTenant>> = new Map();

    constructor(
        @inject('agency_tenant_model') schema: Schema
    ) {
        super(null as unknown as Model<IAgencyTenant>);
        this.chatSchema = schema;
    }


    private async getModel(
        orgId: string
    ): Promise<Model<IAgencyTenant>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IAgencyTenant> = connection.model<IAgencyTenant>(this.modelName, this.chatSchema);
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
    ): Promise<IAgencyTenant[] | null> {
        const model = await this.getModel(orgId);

        const owners = await model.find({})
        if (!owners) throw new NotFoundError('Agency owners not found')
        return owners
    }


    async updateProfile(
        orgId:string,
        details:IUpdateProfile
    ):Promise<IAgencyTenant | null>{
        const model = await this.getModel(orgId);
        return await model.findOneAndUpdate(
            { orgId: orgId },
            {
                profile: details.profile,
                name: details.name,
                bio: details.bio
            },
            { new: true }
        );

    }

    async integratePaymentGateWay(
        orgId:string,
        provider:string,
        details:IIntegratePaymentType
    ):Promise<IAgencyTenant | null>{
        const model = await this.getModel(orgId);
        const user = await model.findOne({orgId:orgId})
        await user?.integratePaymentGateway(provider,details.key1,details.key2,details.webhookUrl || "")
        return await model.findOne({orgId:orgId})
    }

    async getOwnerWithOrgId(
        orgId:string
    ):Promise<IAgencyTenant | null>{
        const model = await this.getModel(orgId);
        return await model.findOne({orgId:orgId})
    }

}
