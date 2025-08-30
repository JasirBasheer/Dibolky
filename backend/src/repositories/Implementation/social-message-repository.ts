import { Model, Schema } from "mongoose";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { connectTenantDB } from "@/config/db.config";
import { ISocialMessage } from "@/models";
import { ISocialMessageRepository } from "../Interface";

@injectable()
export class SocialMessageRepository extends BaseRepository<ISocialMessage> implements ISocialMessageRepository {
    private _socialMessage: Schema;
    private _modelName = 'socialMessage';
    private _models: Map<string, Model<ISocialMessage>> = new Map();

    constructor(
        @inject('social_message_modal') schema: Schema
    ) {
        super(null as unknown as Model<ISocialMessage>);
        this._socialMessage = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<ISocialMessage>> {
        if (this._models.has(orgId)) {
            return this._models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');
        let model: Model<ISocialMessage> = connection.model<ISocialMessage>(this._modelName, this._socialMessage);
        this._models.set(orgId, model);
        return model;
    }

    async createMessages(
        orgId:string,
        messages: object[]
    ): Promise<void> {
        const model = await this.getModel(orgId);
        await model.insertMany(messages)
    }

    async getMessages(orgId: string, userId: string, platform: string, conversationId: string): Promise<ISocialMessage[]> {
        const model = await this.getModel(orgId);
        const messages = await model.find({userId,platform,conversationId})
        return messages
    }


}
