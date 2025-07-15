import { IAgencyTenant } from "../../types/agency";
import { IChat, IGroupDetails, IMessage, Participant } from "../../types/chat";
import { Connection } from "mongoose";

export interface IChatService {
    createChat(userId: string, targetUserId: string, orgId: string, userName: string, targetUserName: string,targetUserProfile:string,userProfile:string): Promise<IChat | null>
    sendMessage(newMessage: object, orgId: string, chatId: string): Promise<IMessage | null>;
    deleteMessage(orgId:string,messageId:string): Promise<IMessage | null>;
    removeMember(orgId:string,chatId:string,memberId:string):Promise<IChat | null>;
    getChats(orgId: string, userId: string): Promise<object[] | null>
    getChat(orgId: string, chatId: string): Promise<object>;
    createGroup(orgId: string, userId: string, details: IGroupDetails): Promise<IChat | null>
    addMember(orgId: string, chatId: string, memberDetails: Participant): Promise<IChat | null>;
    findOwnerDetails(tenantDb: Connection): Promise<IAgencyTenant>;
    createCommonMessage(orgId: string, message: object): Promise<IMessage | null>
    findChatByMembers(orgId: string, userId: string, targetUserId: string): Promise<IChat | null>
    setSeenMessage(orgId:string, chatId:string, userId:string, userName:string):Promise<void>
} 
