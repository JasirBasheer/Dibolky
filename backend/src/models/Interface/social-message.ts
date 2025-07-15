import { ISocialMessageMedia } from "@/types";
import { Document, ObjectId } from "mongoose";


  export interface ISocialMessage extends Document{
    senderId: ObjectId; 
    platform: string
    userId: string;
    isFromMe:boolean;
    externalMessageId: string;
    content?: string;
    media?: ISocialMessageMedia[];
    isDeleted?: boolean;
    timestamp: Date;
    status?: string
    createdAt?: Date;
    updatedAt?: Date;
  }
  