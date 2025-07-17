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
    linkedPage: string,
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

export interface InstagramUser {
  id: string;
  username: string;
}

export interface InstagramConversation {
  id: string;
  participants?: { data: InstagramUser[] };
}
  
export interface InstagramMessage {
  id: string;
  from: InstagramUser;
  to: { data: InstagramUser[] };
  message: string;
  created_time: string;
  attachments?: { data: { id: string; image_data?: { url: string } }[] };
}



