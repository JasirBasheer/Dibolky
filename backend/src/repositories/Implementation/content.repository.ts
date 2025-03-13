import { BaseRepository, CustomError } from "mern.common";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { Schema } from "mongoose";
import { connectTenantDB } from "../../config/db.config";
import { IContentRepository } from "../Interface/IContentRepository";
import { IReviewBucket } from "../../types/common.types";

@injectable()
export class ContentRepository extends BaseRepository<IReviewBucket> implements IContentRepository {
    private reviewBucketSchema: Schema;
    private modelName = 'reviewbucket';
    private models: Map<string, Model<IReviewBucket>> = new Map();

    constructor(
        @inject('review_bucket_model') schema: Schema
    ) {
        super(null as unknown as Model<IReviewBucket>);
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
    ): Promise<IReviewBucket> {
        const model = await this.getModel(details.orgId!);
        const createdContent = await model.create(details);
        if(!createdContent)throw new CustomError("failed to create content",500)
        return createdContent
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
        return await model.find({ user_id: user_id }) || []
    }

    async changeContentStatus(
        orgId: string, 
        contentId: string, 
        status: string
    ): Promise<IReviewBucket | null> {
        const model = await this.getModel(orgId);
        return await model.findByIdAndUpdate(
            { _id: contentId },
            { $set: { status } }
        );
    }

    async getAllScheduledContents(
        orgId: string, 
        user_id: string
    ): Promise<IReviewBucket[]>{
        const model = await this.getModel(orgId)
        return await model.find({
            orgId,
            user_id:user_id,
            "platforms": { 
            $elemMatch: { 
              "scheduledDate": { $ne: "" } 
            } 
          }})
    }

    async reScheduleContent(
        orgId:string,
        content_id:string,
        date:string
    ):Promise<IReviewBucket>{
        const model = await this.getModel(orgId)
        const content = await model.findByIdAndDelete({_id: content_id}, { $set: { date: date } });
        if(!content)throw new CustomError("An unexpected error occured while updating content",500)
        return content
    }
}
