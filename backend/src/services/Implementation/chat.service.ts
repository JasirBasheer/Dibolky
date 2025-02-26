import { inject, injectable } from 'tsyringe';
import { IChatService } from '../Interface/IChatService';
import { IChatRepository } from '../../repositories/Interface/IChatRepository';
import { ownerDetailsSchema } from '../../models/agency/agency.model';
import { CustomError } from 'mern.common';
import { IMessageRepository } from '../../repositories/Interface/IMessageRepository';
import { IChat, IMessage } from '../../shared/types/chat.types';
import { IEntityRepository } from '../../repositories/Interface/IEntityRepository';
import { IAgencyOwner } from '../../shared/types/agency.types';
import { NotFoundError } from 'rxjs';

@injectable()
export default class ChatService implements IChatService {
    private chatRepository: IChatRepository;
    private messageRepository: IMessageRepository;
    private entityRepository: IEntityRepository;

    constructor(
        @inject('ChatRepository') chatRepository: IChatRepository,
        @inject('MessageRepository') messageRepository: IMessageRepository,
        @inject('EntityRepository') entityRepository: IEntityRepository,

    ) {
        this.chatRepository = chatRepository
        this.messageRepository = messageRepository
        this.entityRepository = entityRepository
    }


    async createChat(
        userId: string,
        targetUserId: string,
        orgId: string,
        userName: string,
        targetUserName: string
    ): Promise<IChat | null> {
        try {
            const details = {
                userId, userName,
                targetUserId, targetUserName
            }
            let newChat = await this.chatRepository.createNewChat(orgId, details);
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
            const chat = await this.chatRepository.findChatById(orgId,chatId)
            if(!chat) throw new NotFoundError('Chat not found')
            return await this.messageRepository.createMessage(orgId, chat._id as string, newMessage);
        } catch (error) {
            throw new CustomError("Error while sending message", 500)
        }
    }


    async getChats(
        orgId: string,
        userId: string
    ): Promise<IChat[] | null> {
        try {
            const chats = await this.chatRepository.fetchChats(orgId, userId)
            const plainChats = chats!.map((chat: { toObject: () => any; }) => chat.toObject());

            return await Promise.all(plainChats.map(async (item: any) => {
                const chatMessages = await this.messageRepository.fetchChatMessages(orgId, item._id);
                const sortedMessages = chatMessages.sort((a: any, b: any) => {
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
        tenantDb: any
    ): Promise<IAgencyOwner | null> {
        try {
            const ownerModel = await tenantDb.model("OwnerDetail", ownerDetailsSchema);
            return await this.entityRepository.fetchOwnerDetails(ownerModel)
        } catch (error) {
            throw new CustomError("Error while fetching chats", 500)
        }
    }


    async getChat(
        orgId: string,
        chatId: string
    ): Promise<object> {
        try {
            const chat = await this.chatRepository.findChatById(orgId, chatId);
            if (!chat) throw new Error('Chat not found');

            const plainChat = chat.toObject();
            const messages = await this.messageRepository.fetchChatMessages(orgId, chatId);
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
            throw new CustomError("Error while fetching chat", 500)

        }
    }


    async createGroup(
        orgId: string,
        userId: string,
        details: any
    ): Promise<IChat | null> {
        try {
            const participants = details.members.map((member: { _id: any; type: any; name: any; }) => ({
                userId: member._id,
                type: member.type || null,
                name: member.name || null
            }))

            const newGroupDetails = { name: details.groupName, participants }
            return await this.chatRepository.createNewGroup(orgId, newGroupDetails)
        } catch (error) {
            throw new CustomError("Error while fetching creating group", 500)
        }
    }

    async addMember(
        orgId: string,
        chatId: string,
        memberDetails: any
    ): Promise<IChat | null> {
        try {
            return await this.chatRepository.addMember(orgId, chatId, memberDetails)
        } catch (error) {
            throw new CustomError("Error while adding member", 500)
        }
    }

    async createCommonMessage(
        orgId: string,
        message: object
    ): Promise<IMessage | null> {
        try {
            const newMessage = await this.messageRepository.createCommonMessage(orgId, message)
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
            return await this.chatRepository.findChatByMembers(orgId, userId, targetUserId)
        } catch (error) {
            throw new CustomError("Error while creating common message", 500)
        }
    }

}


