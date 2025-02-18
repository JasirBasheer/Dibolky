
export interface Seen {
    userId: mongoose.Types.ObjectId;
    seenAt: Date;
  }
  
  export interface IMessage extends Document {
    chatId: mongoose.Types.ObjectId;
    type: 'text' | 'common';
    senderId?: mongoose.Types.ObjectId;
    senderName?: string;
    text: string;
    fileUrl?: string;
    seen: Seen[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Participant {
    userId: mongoose.Types.ObjectId;
    type?: string;
    name?: string;
  }
  
  export interface IChat extends Document {
    name?: string;
    participants: Participant[];
    createdAt: Date;
    updatedAt: Date;
  }
  