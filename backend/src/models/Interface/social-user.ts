import { Document } from "mongoose";

export interface ISocialUser extends Document {
    platform: 'facebook' | 'instagram';
    externalUserId: string;
    name?: string;
    avatarUrl?: string;
    linkedPage?: string;
    lastSeen?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  