import { Schema } from 'mongoose';
import { IChat, IMessage } from '../../shared/types/chat.types';


export const messageSchema = new Schema<IMessage>({
  chatId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Chat'
  },
  type: {
    type: String,
    enum: ['text', 'common'],
    default: 'text'
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function(this: IMessage) {
      return this.type !== 'common';
    }
  },
  senderName: {
    type: String,
    required: function(this: IMessage) {
      return this.type !== 'common';
    }
  },
  text: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  seen: [{
    _id: false,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    seenAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });


export const chatSchema = new Schema<IChat>({
  name: { 
    type: String 
  },
  participants: [{
    _id: false,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String
    },
    name: {
      type: String
    }
  }]
}, { timestamps: true });

