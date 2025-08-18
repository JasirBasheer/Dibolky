import { BaseRepository, CustomError } from "mern.common";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { Schema } from "mongoose";
import { connectTenantDB } from "../../config/db.config";
import { IContentRepository } from "../Interface/IContentRepository";
import { IBucket } from "../../types/common";

@injectable()
export class ContentRepository
  extends BaseRepository<IBucket>
  implements IContentRepository
{
  private _BucketSchema: Schema;
  private _modelName = "reviewbucket";
  private _models: Map<string, Model<IBucket>> = new Map();

  constructor(@inject("review_bucket_model") schema: Schema) {
    super(null as unknown as Model<IBucket>);
    this._BucketSchema = schema;
  }

  private async getModel(orgId: string): Promise<Model<IBucket>> {
    if (this._models.has(orgId)) {
      return this._models.get(orgId)!;
    }

    const connection = await connectTenantDB(orgId);
    if (!connection) throw new Error("Connection not found");

    let model: Model<IBucket> = connection.model<IBucket>(
      this._modelName,
      this._BucketSchema
    );
    this._models.set(orgId, model);
    return model;
  }

  async saveContent(details: Partial<IBucket>): Promise<IBucket> {
    const model = await this.getModel(details.orgId!);
    const createdContent = await model.create(details);
    if (!createdContent) throw new CustomError("failed to create content", 500);
    return createdContent;
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
    filter?: Record<string, unknown>,
    options?: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
  ): Promise<{ contents: IBucket[]; totalCount: number; totalPages: number }> {
    const model = await this.getModel(orgId);
    const { page, limit, sort } = options || {};
    const totalCount = await model.countDocuments(filter);

    let query = model.find(filter);
    if (sort) query = query.sort(sort);
    if (limit > 0) query = query.skip((page - 1) * limit).limit(limit);
    const contents = await query.exec();

    return {
      contents,
      totalCount,
      totalPages: limit ? Math.ceil(totalCount / limit) : 1,
    };
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

  async changePlatformStatus(
    orgId: string,
    contentId: string,
    platform: string,
    status: string
  ): Promise<IBucket | null> {
    const model = await this.getModel(orgId);
    return await model.findOneAndUpdate(
      { _id: contentId, "platforms.platform": platform },
      { $set: { "platforms.$.status": status } },
      { new: true }
    );
  }

  async getAllScheduledContents(
    orgId: string,
    user_id: string
  ): Promise<IBucket[]> {
    const model = await this.getModel(orgId);
    return await model.find({
      orgId,
      user_id: user_id,
      platforms: {
        $elemMatch: {
          scheduledDate: { $ne: "" },
        },
      },
    });
  }

  async rescheduleContent(
    orgId: string,
    contentId: string,
    platformId: string,
    date: string
  ): Promise<IBucket> {
    const model = await this.getModel(orgId);
    const content = await model.findOneAndUpdate(
      { _id: contentId, "platforms._id": platformId },
      { $set: { "platforms.$.scheduledDate": date } },
      { new: true }
    );

    if (!content)
      throw new CustomError(
        "An unexpected error occurred while updating content",
        500
      );
    return content;
  }

  async deleteScheduledContent(
    orgId: string,
    contentId: string,
    platformId: string
  ): Promise<void> {
    const model = await this.getModel(orgId);
    const result = await model.updateOne(
      { _id: contentId },
      { $pull: { platforms: { _id: platformId } } }
    );

    if (result.modifiedCount === 0) {
      throw new CustomError("Failed to remove platform from content", 400);
    }
  }
}
