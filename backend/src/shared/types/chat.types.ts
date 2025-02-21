import { Document, Types } from "mongoose";

export interface Seen {
    userId: Types.ObjectId;
    seenAt: Date;
  }
  
  export interface IMessage extends Document {
    chatId: Types.ObjectId;
    type: 'text' | 'common';
    senderId?: Types.ObjectId;
    senderName?: string;
    text: string;
    fileUrl?: string;
    seen: Seen[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Participant {
    userId: Types.ObjectId;
    type?: string;
    name?: string;
  }
  
  export interface IChat extends Document {
    name?: string;
    participants: Participant[];
    createdAt: Date;
    updatedAt: Date;
  }
  