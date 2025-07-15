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
    required: true
  },
  mimeType: String,
  size: Number
});

const socialMessageSchema: Schema<ISocialMessage> = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialUser',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram'],
    required: true
  },
  externalMessageId: {
    type: String,
    required: true,
    index: true
  },
  content: String,
  media: [mediaSchema],
  isDeleted: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['received', 'processed', 'failed'],
    default: 'received'
  }
}, {
  timestamps: true
});

export default model<ISocialMessage>('SocialMessage', socialMessageSchema);
