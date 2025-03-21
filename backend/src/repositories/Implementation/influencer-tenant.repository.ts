import { BaseRepository } from "mern.common";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { Schema } from "mongoose";
import { IInfluencerTenantRepository } from "../Interface/IInfluencerTenantRepository";

@injectable()
export default class InfluencerTenantRepository extends BaseRepository<any> implements IInfluencerTenantRepository {
    private influencerSchema: Schema;
    private modelName = 'influencer';
    private models: Map<string, Model<any>> = new Map();

    constructor(
        @inject('influencer_tenant_model') schema: Schema
    ) {
        super(null as unknown as Model<any>);
        this.influencerSchema = schema;
    }
}