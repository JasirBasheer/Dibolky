import { ISocialMessageMedia } from "@/types";
import { Document, ObjectId } from "mongoose";


  export interface ISocialMessage extends Document{
    senderId: ObjectId; 
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
  