import mongoose from "mongoose";
import { IChatRepository } from "../Interface/IChatRepository";
import { IChat, IMessage } from "../../shared/types/chat.types";

export default class ChatRepository implements IChatRepository {

    async getChat(chatModel: any, userId: string, targetUserId: string): Promise<IChat> {
        return await chatModel.findOne({
            'participants.userId': {
                $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(targetUserId)]
            }
        });
    }


    async createNewChat(chatModel: any, details: any): Promise<IChat> {
        const chat = new chatModel({
            participants: [
                { userId: new mongoose.Types.ObjectId(details.userId), name: details.userName },
                { userId: new mongoose.Types.ObjectId(details.targetUserId), name: details.targetUserName }
            ],
            messages: []
        });
        return await chat.save();
    }

    async findChatById(chatModel: any, chatId: string): Promise<IChat> {
        return await chatModel.findOne({ _id: chatId })
    }


    async createMessage(chatModel: any, messageModel: any, chatId: any, details: any): Promise<{ chat: IChat, message: IMessage[] }> {
        const chat = await chatModel.findOne({ _id: chatId });
        const messageDetails = { chatId: chat._id, ...details }
        const newMessage = new messageModel(messageDetails)
        const message = await newMessage.save();
        return { ...chat, message }
    }

    async fetchChats(chatModel: any, userId: string): Promise<IChat[]> {
        const chats = await chatModel.find({
            participants: {
                $elemMatch: { userId }
            }
        }).sort({ updatedAt: -1 });

        return chats || []
    }

    async fetchMessages(messageModel: any): Promise<IMessage[]> {
        return await messageModel.find();
    }

    async fetchChatMessages(messageModel: any, chatId: string): Promise<IMessage[]> {
        return await messageModel.find({ chatId })
    }



    async fetchChatByChatId(chatModel: any, chatId: string): Promise<IMessage> {
        return await chatModel.findOne({ _id: chatId })
    }

    async createNewGroup(newGroupDetails: any, chatModel: any): Promise<IChat> {
        const newGroup = new chatModel(newGroupDetails)
        return await newGroup.save()
    }


    async findOwnerDetails(ownerModel: any, orgId: string): Promise<any> {
        return await ownerModel.findOne({ orgId: orgId })
    }

    async addMember(chatModel: any, chatId: string, memberDetails: any): Promise<any> {
        const chat = await chatModel.findOne({ _id: chatId })
        chat.participants.push(memberDetails)
        return await chat.save()
    }

    async createCommonMessage(messageModel: any, message: any): Promise<any> {
        const newCommonMessage = messageModel(message)
        return await newCommonMessage.save()
    }

    async findChatByMembers(chatModel: any, userId: string, targetUserId: string): Promise<IChat[]> {
        return await chatModel.findOne({
            participants: {
                $all: [{ $elemMatch: { userId: userId } }, { $elemMatch: { userId: targetUserId } }],
                $size: 2
            }
        });
    }

}
