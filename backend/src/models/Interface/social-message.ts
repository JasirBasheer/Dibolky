import { ISocialMessageMedia } from "@/types";
import { Document } from "mongoose";


  export interface ISocialMessage extends Document{
    senderId: string; 
    platform: string
    userId: string;
    isFromMe:boolean;
    linkedPage:string;
    externalMessageId: string;
    content?: string;
    media?: ISocialMessageMedia[];
    isDeleted?: boolean;
    timestamp: Date;
    status?: string
    createdAt?: Date;
    updatedAt?: Date;
    conversationId:string;
  }
  