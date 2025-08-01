
export interface ISocialUserType {
    _id?:string;
    platform: 'facebook' | 'instagram';
    externalUserId: string;
    name?: string;
    userId: string;
    profile?: string;
    linkedPage?: string;
    lastSeen?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    userName:string;
    conversationId: string;

  }
  