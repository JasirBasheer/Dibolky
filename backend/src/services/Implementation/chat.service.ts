import { inject, injectable } from 'tsyringe';
import { IChatService } from '../Interface/IChatService';
import { IChatRepository } from '../../repositories/Interface/IChatRepository';
import { connectTenantDB } from '../../config/db';
import { chatSchema, messageSchema } from '../../models/chat/chat';
import { getSecretRoomId } from '../../shared/utils/util';
import mongoose from 'mongoose';
import { ownerDetailsSchema } from '../../models/agency/agency.model';
import { CustomError } from 'mern.common';

@injectable()
export default class ChatService implements IChatService {
    private chatRepository: IChatRepository;

    constructor(
        @inject('ChatRepository') chatRepository: IChatRepository,

    ) {
        this.chatRepository = chatRepository
    }


    async createChat(userId: string, targetUserId: string, orgId: string, userName: string, targetUserName: string): Promise<any> {
        try {
            const db = await connectTenantDB(orgId);
            const chatModel = db.model("chat", chatSchema);
            const details = {
                userId, userName,
                targetUserId, targetUserName
            }
            let newChat = await this.chatRepository.createNewChat(chatModel, details);
            if (!newChat) throw new CustomError("Error while create new chat", 500)
            return newChat
        } catch (error) {
            console.log(error)
        }
    }



    async sendMessage(newMessage: any, orgId: any, chatId: string): Promise<any> {
        try {
            const db = await connectTenantDB(orgId);
            const chatModel = db.model("chat", chatSchema);
            const messageModel = db.model("message", messageSchema);

            return await this.chatRepository.createMessage(chatModel, messageModel, chatId, newMessage);
        } catch (error) {
            console.log("Error in sendMessage:", error);
        }
    }

    async getChats(tenantDb: any, userId: string): Promise<any> {
        try {
            const chatModel = await tenantDb.model("chat", chatSchema);
            const messageModel = await tenantDb.model("message", messageSchema);
            const chats =  await this.chatRepository.fetchChats(chatModel, userId)
            const plainChats = chats.map((chat: { toObject: () => any; }) => chat.toObject());

            return await Promise.all(plainChats.map(async (item :any) => {
                const chatMessages = await this.chatRepository.fetchChatMessages(messageModel, item._id);
                const sortedMessages = chatMessages.sort((a: any, b: any) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                });
                return {
                    ...item,
                    messages: sortedMessages
                };
            }));
            
        } catch (error) {
            console.log(error)
        }
    }

    async findOwnerDetails(tenantDb: any, orgId: string): Promise<any> {
        try {
            const ownerModel = await tenantDb.model("OwnerDetail", ownerDetailsSchema);
            return await this.chatRepository.findOwnerDetails(ownerModel, orgId)
        } catch (error) {
            console.log(error)
        }
    }


    async getChat(tenantDb: any, chatId: string): Promise<any> {
        try {
            const chatModel = tenantDb.model("chat", chatSchema);
            const messageModel = tenantDb.model("message", messageSchema); 
    
            const chat = await this.chatRepository.fetchChatByChatId(chatModel, chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            const plainChat = chat.toObject();
            const messages = await this.chatRepository.fetchChatMessages(messageModel, chatId);
            const sortedMessages = messages.length > 0 ? 
                messages.sort((a: any, b: any) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }) : 
                [];
    
            return {
                ...plainChat,
                messages: sortedMessages
            };
    
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }

    async createGroup(orgId: string, userId: string, details: any): Promise<any> {
        try {
            const tenantDb = await connectTenantDB(orgId)
            const chatModel = tenantDb.model("chat", chatSchema);
            const participants = details.members.map((member: { _id: any; type: any; name: any; }) => ({
                userId: member._id,
                type: member.type || null,
                name: member.name || null
            }))

            const newGroupDetails = { name: details.groupName, participants }
            return await this.chatRepository.createNewGroup(newGroupDetails, chatModel)
        } catch (error) {
            console.log(error)

        }
    }

    async addMember(orgId:string,chatId:string,memberDetails:any): Promise<any>{
        try {
            const tenantDb = await connectTenantDB(orgId)
            const chatModel = tenantDb.model("chat", chatSchema);
            return await this.chatRepository.addMember(chatModel,chatId,memberDetails)
                  
        } catch (error) {
            console.log(error)
        }
    }

    async createCommonMessage(orgId:string,message:any):Promise<any>{
        try {
            const tenantDb = await connectTenantDB(orgId)
            const messageModel = tenantDb.model("message", messageSchema);
            return await this.chatRepository.createCommonMessage(messageModel,message)
                  
        } catch (error) {
            console.log(error)
        }
    }

    async findChatByMembers(orgId:string,userId:string,targetUserId:string):Promise<any>{
        const tenantDb = await connectTenantDB(orgId)
        const chatModel = tenantDb.model("chat", chatSchema);
        return await this.chatRepository.findChatByMembers(chatModel,userId,targetUserId)
    }



}


