import { Model, Schema, Types } from "mongoose";
import { IMessage } from "../../types/chat";
import { IMessageRepository } from "../Interface/IMessageRepository";
import { connectTenantDB } from "../../config/db.config";
import { inject, injectable } from "tsyringe";
import { BaseRepository, CustomError } from "mern.common";

@injectable()
export default class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
    private messageSchema: Schema;
    private modelName = 'message';
    private models: Map<string, Model<IMessage>> = new Map();

    constructor(
        @inject('message_model') schema: Schema
    ) {
        super(null as unknown as Model<IMessage>);
        this.messageSchema = schema;
    }

    private async getModel(
        orgId: string
    ): Promise<Model<IMessage>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!;
        }

        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IMessage> = connection.model<IMessage>(this.modelName, this.messageSchema);
        this.models.set(orgId, model);
        return model;
    }


    async createMessage(
        orgId: string,
        chatId:string,
        messageDetails: Partial<IMessage>
    ): Promise<IMessage | null> {
        const model = await this.getModel(orgId);
        const newMessage = { chatId: chatId, ...messageDetails }
        const message = new model(newMessage)
        return await message.save();
    }

    async deleteMessage(
        orgId: string, 
        messageId: string
    ): Promise<IMessage | null>{
        const model = await this.getModel(orgId)
        const result = await model.findOneAndUpdate(
            { _id: messageId },
            { 
                $set: {
                    type: "deleted",
                    text: "",
                    fileUrl: ""
                }
            },
            { new: true }
        )
        
        return result
    }



    async fetchMessages(
        orgId: string
    ): Promise<IMessage[] | null> {
        const model = await this.getModel(orgId);
        return await model.find();
    }

    async fetchChatMessages(
        orgId: string,
        chatId: string
    ): Promise<IMessage[]> {
        const model = await this.getModel(orgId);
        return await model.find({ chatId })
    }
    
    async getMessageById(
        orgId: string,
        messageId: string
    ): Promise<IMessage> {
        const model = await this.getModel(orgId);
        const message = await model.findOne({ _id:messageId })
        if(!message)throw new CustomError("Message not found",500)
        return message
    }

    async fetchChatByChatId(
        orgId: string,
        chatId: string
    ): Promise<IMessage[]> {
        const model = await this.getModel(orgId);
        return await model.find({ chatId })
    }


    async createCommonMessage(
        orgId: string,
        message: Partial<IMessage>
    ): Promise<IMessage | null> {
        const model = await this.getModel(orgId);
        const newCommonMessage = new model(message)
        return await newCommonMessage.save()
    }

    async setSeenMessage(
        orgId:string,
        messageId:string,
        details:{userId:Types.ObjectId,userName:string,seenAt:Date}
    ): Promise<void>{
        const model = await this.getModel(orgId);
        const message = await model.findOne({_id:messageId})
        if(!message)throw new CustomError("Message not found",500)
        if (!message.seen) message.seen = [];
        message?.seen.push(details)
        await message.save()
    }


}
