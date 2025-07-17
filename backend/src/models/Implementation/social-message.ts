import { ISocialMessageMedia } from "@/types";
import { model, Schema } from "mongoose";
import { ISocialMessage } from "../Interface";


const mediaSchema: Schema<ISocialMessageMedia> = new Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: {
    type: String,
  },
  id: {
    type: String,
  },
  mimeType: String,
  size: Number
});

export const socialMessageSchema: Schema<ISocialMessage> = new Schema({
  senderId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  linkedPage:{
    type: String,
    required: true
  },
  conversationId:{
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  isFromMe: {
    type: Boolean,
    required: true
  },
  externalMessageId: {
    type: String,
  },
  content: String,
  media: [mediaSchema],
  isDeleted: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
  },
  status: {
    type: String,
    default: 'received'
  }
}, {
  timestamps: true
});

export default model<ISocialMessage>('SocialMessage', socialMessageSchema);
