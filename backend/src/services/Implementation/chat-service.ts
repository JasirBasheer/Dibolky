import { inject, injectable } from 'tsyringe';
import { IChatService } from '../Interface/IChatService';
import { IChatRepository } from '../../repositories/Interface/IChatRepository';
import { agencyTenantSchema } from '../../models/Implementation/agency';
import { CustomError, NotFoundError } from 'mern.common';
import { IMessageRepository } from '../../repositories/Interface/IMessageRepository';
import { IChat, IGroupDetails, IMessage, Participant } from '../../types/chat';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IAgencyTenant } from '../../types/agency';
import { Connection, Types } from 'mongoose';
import { deleteS3Object } from '../../utils/aws.utils';

@injectable()
export class ChatService implements IChatService {
    private _chatRepository: IChatRepository;
    private _messageRepository: IMessageRepository;
    private _entityRepository: IEntityRepository;

    constructor(
        @inject('ChatRepository') chatRepository: IChatRepository,
        @inject('MessageRepository') messageRepository: IMessageRepository,
        @inject('EntityRepository') entityRepository: IEntityRepository,

    ) {
        this._chatRepository = chatRepository
        this._messageRepository = messageRepository
        this._entityRepository = entityRepository
    }


    async createChat(
        userId: string,
        targetUserId: string,
        orgId: string,
        userName: string,
        targetUserName: string,
        targetUserProfile:string,
        userProfile:string
    ): Promise<IChat | null> {
        try {
            const details = {
                userId, userName,
                targetUserId, targetUserName,targetUserProfile,userProfile
            }
            let newChat = await this._chatRepository.createNewChat(orgId, details);
            if (!newChat) throw new CustomError("Error while create new chat", 500)
            return newChat
        } catch (error) {
            throw new CustomError("Error while creating chat", 500)
        }
    }



    async sendMessage(
        newMessage: object,
        orgId: string,
        chatId: string
    ): Promise<IMessage | null> {
        try {
            const chat = await this._chatRepository.findChatById(orgId,chatId)
            if(!chat) throw new NotFoundError('Chat not found')
            return await this._messageRepository.createMessage(orgId, chat._id as string, newMessage);
        } catch (error) {
            throw new CustomError("Error while sending message", 500)
        }
    }

    async removeMember(
        orgId:string,
        chatId:string,
        memberId:string
    ):Promise<IChat | null>{
        try {
            console.log(orgId,chatId,memberId)
            return await this._chatRepository.removeMember(orgId, chatId, memberId);
        } catch (error) {
            throw new CustomError("Error while sending message", 500)
        }
    }
    


    async deleteMessage(
        orgId:string,
        messageId:string,
    ): Promise<IMessage | null>{
        try {
            const message = await this._messageRepository.getMessageById(orgId,messageId)
            if(message.key && message.key!=""){
                await deleteS3Object(message.key as string)
            }

            const deletedMessage = await this._messageRepository.deleteMessage(orgId,messageId)
            if(!deletedMessage) throw new CustomError("Error while deleting message",500)
            return deletedMessage
        } catch (error) {
            throw new CustomError("Error while deleting message",500)
        }
    }

    async getChats(
        orgId: string,
        userId: string
    ): Promise<object[] | null> {
        try {
            const chats = await this._chatRepository.fetchChats(orgId, userId)
            const plainChats = chats!.map((chat: { toObject: () => IChat; }) => chat.toObject());

            return await Promise.all(plainChats.map(async (item: IChat) => {
                const chatMessages = await this._messageRepository.fetchChatMessages(orgId, item._id as string);
                const sortedMessages = chatMessages.sort((a: IMessage, b: IMessage) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                });
                return {
                    ...item,
                    messages: sortedMessages
                };
            }));

        } catch (error) {
            throw new CustomError("Error while fetching chats", 500)
        }
    }


    async findOwnerDetails(
        tenantDb: Connection
    ): Promise<IAgencyTenant> {
        try {
            const ownerModel = tenantDb.model("OwnerDetail", agencyTenantSchema);
            const details =  await this._entityRepository.fetchOwnerDetails(ownerModel)
            if(!details)throw new CustomError("owner Details not found",500)
            return details[0]
        } catch (error) {
            throw new CustomError("Error while fetching chats", 500)
        }
    }


    async getChat(
        orgId: string,
        chatId: string
    ): Promise<object> {
        try {
            const chat = await this._chatRepository.findChatById(orgId, chatId);
            if (!chat) throw new Error('Chat not found');

            const plainChat = chat.toObject();
            const messages = await this._messageRepository.fetchChatMessages(orgId, chatId);
            const sortedMessages = messages.length > 0 ?
                messages.sort((a: IMessage, b: IMessage) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }) :
                [];

            return {
                ...plainChat,
                messages: sortedMessages
            };

        } catch (error) {
            throw new CustomError("Error while fetching chat", 500)

        }
    }


    async createGroup(
        orgId: string,
        userId: string,
        details: IGroupDetails
    ): Promise<IChat | null> {
        try {

            const participants = details.members.map((member: Participant) => ({
                userId: new Types.ObjectId(member._id),
                type: member.type || "",
                profile:member.profile || "",
                name: member.name || ""
              }));
              

            const newGroupDetails:Partial<IChat>  = { name: details.groupName, participants }
            return await this._chatRepository.createNewGroup(orgId, newGroupDetails)
        } catch (error) {
            throw new CustomError("Error while fetching creating group", 500)
        }
    }

    async addMember(
        orgId: string,
        chatId: string,
        memberDetails: Participant
    ): Promise<IChat | null> {
        try {
            return await this._chatRepository.addMember(orgId, chatId, memberDetails)
        } catch (error) {
            throw new CustomError("Error while adding member", 500)
        }
    }

    async createCommonMessage(
        orgId: string,
        message: object
    ): Promise<IMessage | null> {
        try {
            const newMessage = await this._messageRepository.createCommonMessage(orgId, message)
            if (!newMessage) throw new CustomError("Error occured while creating common message", 500)
            return newMessage
        } catch (error) {
            throw new CustomError("Error while creating common message", 500)
        }
    }

    async findChatByMembers(
        orgId: string,
        userId: string,
        targetUserId: string
    ): Promise<IChat | null> {
        try {
            return await this._chatRepository.findChatByMembers(orgId, userId, targetUserId)
        } catch (error) {
            throw new CustomError("Error while creating common message", 500)
        }
    }

    async setSeenMessage(
        orgId:string, 
        chatId:string, 
        userId:string, 
        userName:string
    ):Promise<void>{
        try {
            const messages = await this._messageRepository.fetchChatMessages(orgId,chatId)
            for(const message of messages){
                if(!message.seen.some((user) => String(user.userId) == userId)){
                    const details = {
                        userId: new Types.ObjectId(userId),
                        userName,
                        seenAt:Date.now()
                    }
                    await this._messageRepository.setSeenMessage(orgId,message._id as string,details) 
                }
                    
            }
        } catch (error) {
            throw new CustomError("Error while setting seen message", 500)
        }
    }

}


