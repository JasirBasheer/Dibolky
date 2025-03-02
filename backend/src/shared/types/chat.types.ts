import { Document, Types } from "mongoose";

export interface Seen {
    userId: Types.ObjectId;
    seenAt: Date;
  }
  
  export interface IMessage extends Document {
    chatId: Types.ObjectId;
    type: 'text' | 'common';
    senderId?: Types.ObjectId;
    senderName?: string;
    text: string;
    fileUrl?: string;
    seen: Seen[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Participant {
    _id?:string
    userId?: Types.ObjectId ;
    type?: string;
    name?: string;
  }
  
  export interface IChat extends Document {
    name?: string;
    participants?: Participant[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  

  export interface IChatDetails {
    userId:string;
    userName:string;
    targetUserId:string;
    targetUserName:string;
}


export interface IGroupDetails {
  groupName:string;
  members:Participant[]

}

export interface IAvailableClients{
  _id:string;
  name:string;
  type:string;
  email:string;
}


export interface Service  {
  serviceName: string;
  serviceDetails: {
    deadline: string; 
    [key: string]: string;
  }
};

export interface ServicesData  {
  [key: string]: Service;
};
