import { Document } from "mongoose";

export interface ISocialUser extends Document {
  platform: string;
  externalUserId: string;
  conversationId?:string;
  userName: string;
  userId: string;
  name: string;
  profile: string;
  linkedPage: string;
  lastSeen: Date;
}
