
export interface ISocialUserType {
    _id?:string;
    platform: 'facebook' | 'instagram';
    externalUserId: string;
    name?: string;
    avatarUrl?: string;
    linkedPage?: string;
    lastSeen?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  