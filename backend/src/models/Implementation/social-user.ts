import { model, Schema } from "mongoose";
import { ISocialUser } from "../Interface";


const socialUserSchema:Schema<ISocialUser> = new Schema({
  platform: {
    type: String,
    enum: ['facebook', 'instagram'],
    required: true
  },
  externalUserId: {
    type: String,
    required: true,
    index: true
  },
  name: String,
  avatarUrl: String,
  linkedPage: String,
  lastSeen: Date
}, {
  timestamps: true
});

export default model<ISocialUser>('SocialUser', socialUserSchema);
