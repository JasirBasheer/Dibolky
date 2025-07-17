
export interface ISocialUserType {
    _id?:string;
    platform: 'facebook' | 'instagram';
    externalUserId: string;
    name: string;
    profile?: string;
    linkedPage?: string;
    userId:string;
    lastSeen?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    userName:string;
    conversationId: string,

}
  