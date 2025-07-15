export interface ISocialMessageMedia {
    type: 'image' | 'video';
    url: string;
    mimeType?: string;
    size?: number;
  }
  
  export interface ISocialMessageType {
    _id?: string;
    senderId: string; 
    platform: 'facebook' | 'instagram';
    externalMessageId: string;
    content?: string;
    media?: ISocialMessageMedia[];
    isDeleted?: boolean;
    timestamp: Date;
    status?: 'received' | 'processed' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
  }
  