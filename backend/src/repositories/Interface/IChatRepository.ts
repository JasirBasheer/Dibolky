export interface IChatRepository {
    getChat(chatModel: any, userId: any, targetUserId: any): Promise<any>;
    findChatById(chatModel:any,chatId:string): Promise<any>;
    createNewChat(chatModel: any, details:any): Promise<any>;
    createMessage(chatModel: any,chatId:string, details: any): Promise<any>;
    fetchChats(chatModel: any, userId: string): Promise<any>;
    fetchChatByChatId(chatModel: any, chatId:string): Promise<any>;
    createNewGroup(newGroupDetails:any,tenantDb:any): Promise<any>;
    findOwnerDetails(ownerModel:any,orgId:string):Promise<any>
    addMember(chatModel:any,chatId:string,memberDetails:any):Promise<any>;
    createCommonMessage(chatModel:any,chatId:string,message:any):Promise<any>;
    findChatByMembers(chatModel:any,userId:string,targetUserId:string):Promise<any>;

