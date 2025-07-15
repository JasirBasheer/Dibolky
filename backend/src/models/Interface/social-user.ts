import { Document } from "mongoose";

export interface ISocialUser extends Document {
  platform: string;
  externalUserId: string;
  userId: string;
  pageId:string;
  name: string;
  avatarUrl: string;
  linkedPage: string;
  lastSeen: Date;
}
