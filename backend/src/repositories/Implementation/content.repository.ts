import { BaseRepository, CustomError } from "mern.common";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { Schema } from "mongoose";
import { connectTenantDB } from "../../config/db.config";
import { IContentRepository } from "../Interface/IContentRepository";
import { IBucket } from "../../types/common.types";

@injectable()
export class ContentRepository extends BaseRepository<IBucket> implements IContentRepository {
    private BucketSchema: Schema;
    private modelName = 'reviewbucket';
    private models: Map<string, Model<IBucket>> = new Map();

    constructor(
        @inject('review_bucket_model') schema: Schema
    ) {
        super(null as unknown as Model<IBucket>);
        this.BucketSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<IBucket>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!;
        }

        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IBucket> = connection.model<IBucket>(this.modelName, this.BucketSchema);
        this.models.set(orgId, model);
        return model;
    }


    async saveContent(
        details: Partial<IBucket>
    ): Promise<IBucket> {
        const model = await this.getModel(details.orgId!);
        const createdContent = await model.create(details);
        if(!createdContent)throw new CustomError("failed to create content",500)
        return createdContent
    }

    async getContentById(
        orgId: string, 
        contentId: string
    ): Promise<IBucket | null> {
        const model = await this.getModel(orgId);
        return await model.findOne({ _id: contentId });
    }

    async getContentsByUserId(
        orgId: string, 
        user_id: string
    ): Promise<IBucket[] | null> {
        const model = await this.getModel(orgId);
        return await model.find({ user_id: user_id }) || []
    }

    async changeContentStatus(
        orgId: string, 
        contentId: string, 
        status: string
    ): Promise<IBucket | null> {
        const model = await this.getModel(orgId);
        return await model.findByIdAndUpdate(
            { _id: contentId },
            { $set: { status } }
        );
    }

    async getAllScheduledContents(
        orgId: string, 
        user_id: string
    ): Promise<IBucket[]>{
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
    ):Promise<IBucket>{
        const model = await this.getModel(orgId)
        const content = await model.findByIdAndDelete({_id: content_id}, { $set: { date: date } });
        if(!content)throw new CustomError("An unexpected error occured while updating content",500)
        return content
    }


}
