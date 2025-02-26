import mongoose, { Model, Schema } from "mongoose";
import { IChatRepository } from "../Interface/IChatRepository";
import { IChat } from "../../shared/types/chat.types";
import { BaseRepository } from "mern.common";
import { inject, injectable } from "tsyringe";
import { connectTenantDB } from "../../config/db";
import { NotFoundError } from "rxjs";

@injectable()
export default class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
    private chatSchema: Schema;
    private modelName = 'chat';
    private models: Map<string, Model<IChat>> = new Map();

    constructor(
        @inject('chat_model') schema: Schema
    ) {
        super(null as any);
        this.chatSchema = schema;
    }


    private async getModel(
        orgId: string
    ): Promise<Model<IChat>> {
        if (this.models.has(orgId)) {
            return this.models.get(orgId)!
        }
        const connection = await connectTenantDB(orgId);
        if (!connection) throw new Error('Connection not found');

        let model: Model<IChat> = connection.model<IChat>(this.modelName, this.chatSchema);
        this.models.set(orgId, model);
        return model;
    }


    async getChat(
        orgId: string,
        userId: string,
        targetUserId: string
    ): Promise<IChat | null> {
        const model = await this.getModel(orgId);

        return await model.findOne({
            'participants.userId': {
                $all: [
                    new mongoose.Types.ObjectId(userId),
                    new mongoose.Types.ObjectId(targetUserId)
                ]
            }
        });
    }


    async findChatById(
        orgId: string,
        chatId: string
    ): Promise<IChat | null> {
        const model = await this.getModel(orgId);
        return await model.findOne({ _id: chatId })
    }


    async createNewChat(
        orgId: string,
        details: any
    ): Promise<IChat | null> {
        const model = await this.getModel(orgId);

        const chat = new model({
            participants: [
                { userId: new mongoose.Types.ObjectId(details.userId), name: details.userName },
                { userId: new mongoose.Types.ObjectId(details.targetUserId), name: details.targetUserName }
            ],
            messages: []
        });
        return await chat.save();
    }



    async fetchChats(
        orgId: string,
        userId: string
    ): Promise<IChat[] | null> {
        const model = await this.getModel(orgId);

        const chats = await model.find({
            participants: {
                $elemMatch: { userId }
            }
        }).sort({ updatedAt: -1 });

        return chats || []
    }


    async createNewGroup(
        orgId: string,
        newGroupDetails: any,
    ): Promise<IChat> {
        const model = await this.getModel(orgId);
        const newGroup = new model(newGroupDetails)
        return await newGroup.save()
    }


    async addMember(
        orgId: string,
        chatId: string,
        memberDetails: any
    ): Promise<IChat> {
        const model = await this.getModel(orgId);

        const chat = await model.findOne({ _id: chatId })
        if (!chat) throw new NotFoundError('Chat not found')
        chat.participants.push(memberDetails)
        return await chat.save()
        }


    async findChatByMembers(
        orgId: string,
        userId: string,
        targetUserId: string
    ): Promise<IChat | null> {
        const model = await this.getModel(orgId);

        return await model.findOne({
            participants: {
                $all: [
                    { $elemMatch: { userId: userId } },
                    { $elemMatch: { userId: targetUserId } }
                ],
                $size: 2
            }
        });
    }

}
