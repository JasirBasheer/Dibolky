import { IAgencyOwner } from "../../shared/types/agency.types";
import { IChat, IMessage } from "../../shared/types/chat.types";

export interface IChatService {
    createChat(userId: string, targetUserId: string, orgId: string, userName: string, targetUserName: string): Promise<IChat | null>
    sendMessage(newMessage: any, orgId: string, chatId: string): Promise<IMessage | null>;
    getChats(orgId: string, userId: string): Promise<IChat[] | null>
    getChat(orgId: string, chatId: string): Promise<Record<string,any> | null>;
    createGroup(orgId: string, userId: string, details: any): Promise<IChat | null>
    addMember(orgId: string, chatId: string, memberDetails: any): Promise<IChat | null>;
    findOwnerDetails(tenantDb: any): Promise<IAgencyOwner | null>;
    createCommonMessage(orgId: string, message: object): Promise<IMessage | null>
    findChatByMembers(orgId: string, userId: string, targetUserId: string): Promise<IChat | null>
}