import { model, Schema } from "mongoose";
import { ISocialUser } from "../Interface";


export const socialUserSchema:Schema<ISocialUser> = new Schema({
  platform: {
    type: String,
    required: true
  },
  userId:{
    type: String,
    required: true,
    index: true

  },
  pageId: {
    type: String,
    required: true,
  },
  externalUserId: {
    type: String,
    required: true,
  },
  name: String,
  avatarUrl: String,
  linkedPage: String,
  lastSeen: Date
}, {
  timestamps: true
});

export default model<ISocialUser>('SocialUser', socialUserSchema);
