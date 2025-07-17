export interface ISocialMessageMedia {
    id?:string;
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
    linkedPage?: string;
    content?: string;
    media?: ISocialMessageMedia[];
    isDeleted?: boolean;
    timestamp: Date;
    status?: 'received' | 'processed' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
    conversationId: string;
    isFromMe:string;
  }
