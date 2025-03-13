import { IChat, IChatDetails, IGroupDetails, Participant } from "../../types/chat.types";

export interface IChatRepository {
    createNewChat(orgId: string, details: IChatDetails): Promise<IChat | null>;
    removeMember(orgId:string, chatId:string, memberId:string):Promise<IChat | null>;
    getChat(orgId: string, userId: string, targetUserId: string): Promise<IChat | null>;
    findChatById(orgId: string, chatId: string): Promise<IChat | null>;
    fetchChats(orgId: string, userId: string): Promise<IChat[] | null>;
    createNewGroup(orgId: string, newGroupDetails: Partial<IChat> ): Promise<IChat | null>;
    addMember(orgId: string, chatId: string, memberDetails: Participant): Promise<IChat | null>;
    findChatByMembers(orgId: string, userId: string, targetUserId: string): Promise<IChat | null>;
}