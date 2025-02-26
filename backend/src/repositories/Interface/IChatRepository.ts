import { IChat } from "../../shared/types/chat.types";

export interface IChatRepository {
    createNewChat(orgId: string, details: any): Promise<IChat | null>;
    getChat(orgId: string, userId: string, targetUserId: string): Promise<IChat | null>;
    findChatById(orgId: string, chatId: string): Promise<IChat | null>;
    fetchChats(orgId: string, userId: string): Promise<IChat[] | null>;
    createNewGroup(orgId: string, newGroupDetails: any): Promise<IChat | null>;
    addMember(orgId: string, chatId: string, memberDetails: any): Promise<IChat | null>;
    findChatByMembers(orgId: string, userId: string, targetUserId: string): Promise<IChat | null>;
}