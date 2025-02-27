import { BaseRepository } from "mern.common";
import { inject, injectable } from "tsyringe";
import { IReviewBucket } from "../../shared/types/agency.types";
import { Model } from "mongoose";
import { Schema } from "mongoose";
import { connectTenantDB } from "../../config/db";
import { IContentRepository } from "../Interface/IContentRepository";

@injectable()
export class ContentRepository extends BaseRepository<IReviewBucket> implements IContentRepository {
    private reviewBucketSchema: Schema;
    private modelName = 'reviewbucket';
    private models: Map<string, Model<IReviewBucket>> = new Map();

    constructor(
        @inject('review_bucket_model') schema: Schema
    ) {
        super(null as any);
        this.reviewBucketSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<IReviewBucket>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!;
        }

        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IReviewBucket> = connection.model<IReviewBucket>(this.modelName, this.reviewBucketSchema);
        this.models.set(orgId, model);
        return model;
    }


    async saveContent(
        details: Partial<IReviewBucket>
    ): Promise<IReviewBucket | null> {
        const model = await this.getModel(details.orgId!);
        return await model.create(details);
    }

    async getContentById(
        orgId: string, 
        contentId: string
    ): Promise<IReviewBucket | null> {
        const model = await this.getModel(orgId);
        return await model.findOne({ _id: contentId });
    }

    async getContentsByUserId(
        orgId: string, 
        user_id: string
    ): Promise<IReviewBucket[] | null> {
        const model = await this.getModel(orgId);
        return await model.find({ user_id: user_id });
    }

    async changeContentStatus(
        orgId: string, 
        contentId: string, 
        status: string
    ): Promise<IReviewBucket | null> {
        const model = await this.getModel(orgId);
        return await model.findByIdAndDelete(
            { _id: contentId },
            { $set: { status } }
        );
    }
}
