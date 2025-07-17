import { model, Schema } from "mongoose";
import { ISocialUser } from "../Interface";


export const socialUserSchema:Schema<ISocialUser> = new Schema({
  platform: {
    type: String,
    required: true
  },
  userId:{
    type: String,
  },
  externalUserId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  linkedPage: {
    type: String,
    required: true,
  },
  lastSeen: {
    type: Date,
    required: true,
  },
  conversationId:{
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default model<ISocialUser>('SocialUser', socialUserSchema);
