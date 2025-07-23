import { Document, Types } from "mongoose";

export interface Seen {
    userId: Types.ObjectId;
    userName: string;
    seenAt: Date;
  }
  
  export interface IMessage extends Document {
    chatId: Types.ObjectId;
    type: 'text' | 'common' | 'deleted';
    senderId?: Types.ObjectId;
    senderName?: string;
    text: string;
    key?: string;
    contentType?:string;
    profile?:string;
    seen: Seen[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Participant {
    _id?:string
    userId?: Types.ObjectId ;
    type?: string;
    profile?:string;
    name?: string;
  }
  
  export interface IChat extends Document {
    name?: string;
    participants: Participant[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  

  export interface IChatDetails {
    userId:string;
    userName:string;
    userProfile:string;
    targetUserId:string;
    targetUserName:string;
    targetUserProfile:string;
}


export interface IGroupDetails {
  groupName:string;
  members:Participant[]

}

export interface IAvailableClients{
  _id:string;
  name:string;
  type:string;
  profile?:string;
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
