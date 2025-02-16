export interface IChatService {
    createChat(userId: string, targetUserId: string, orgId: string, userName: string, targetUserName: string): Promise<any>
    sendMessage(newMessage: any, orgId: any, chatId: string): Promise<any>;
    getChats(tenantDb: any, userId: string): Promise<any>
    getChat(tenantDb: any, chatId:string): Promise<any>
    createGroup(orgId: string, userId: string, details: any): Promise<any>
    findOwnerDetails(tenantDb: any, orgId: string): Promise<any>;
    addMember(orgId:string,chatId:string,memberDetails:any): Promise<any>;
    createCommonMessage(orgId:string,chatId:string,message:any):Promise<any>
    findChatByMembers(orgId:string,userId:string,targetUserId:string):Promise<any>
}