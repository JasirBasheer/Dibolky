import mongoose, { Model, Schema, Types } from "mongoose";
import { IChatRepository } from "../Interface/IChatRepository";
import { IChat, IChatDetails, IGroupDetails, Participant } from "../../types/chat.types";
import { BaseRepository, CustomError, NotFoundError } from "mern.common";
import { inject, injectable } from "tsyringe";
import { connectTenantDB } from "../../config/db.config";

@injectable()
export default class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
    private chatSchema: Schema;
    private modelName = 'chat';
    private models: Map<string, Model<IChat>> = new Map();

    constructor(
        @inject('chat_model') schema: Schema
    ) {
        super(null as unknown as Model<IChat>);
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
        details: IChatDetails
    ): Promise<IChat | null> {
        const model = await this.getModel(orgId);

        const chat = new model({
            participants: [
                { userId: new mongoose.Types.ObjectId(details.userId), name: details.userName, profile:details.userProfile },
                { userId: new mongoose.Types.ObjectId(details.targetUserId), name: details.targetUserName, profile:details.targetUserProfile }
            ],
            messages: []
        });
        return await chat.save();
    }

    async removeMember(
        orgId:string, 
        chatId:string, 
        memberId:string
    ):Promise<IChat | null>{
        const model = await this.getModel(orgId)
        const chat = await model.findOne({_id:chatId})
        if(!chat)throw new CustomError("chat not found",500)
        chat.participants = chat.participants?.filter(
            (member) => String(member.userId) !== String(memberId)
        );
        return await chat?.save() 
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
        newGroupDetails:Partial<IChat> ,
    ): Promise<IChat> {
        const model = await this.getModel(orgId);
        const newGroup = new model(newGroupDetails)
        return await newGroup.save()
    }


    async addMember(
        orgId: string,
        chatId: string,
        memberDetails: Participant
    ): Promise<IChat> {
        const model = await this.getModel(orgId);

        const chat = await model.findOne({ _id: chatId })
        if (!chat) throw new NotFoundError('Chat not found')
        chat.participants = chat.participants || [];
        chat.participants.push(memberDetails);
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
