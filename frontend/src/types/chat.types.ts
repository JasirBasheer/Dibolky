import { Socket } from "socket.io-client";

export interface Seen {
    userId: string;
    userName:string;
    seenAt: Date | string | number;
  }

export interface IMessage {
    _id?:string;
    chatId?: string;  
    type: 'text' | 'common' |'deleted';
    senderId?: string; 
    senderName?: string;
    text: string;
    key?: string;
    seen: Seen[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}


export interface IChatUser {
    organizationName?: string;
    id: string;
    orgId: string;
    name: string;
    profile?:string;
  }

export interface ISocketRef{
  current:Socket
}

export interface ChatItemProps {
  name: string;
  active: boolean;
  onClick: () => void;
  isGroup?: boolean;
  messages: IMessage[];
  userId: string;
  socket: Socket | null;
  chat_id:string;
  isMemberActive?:boolean;
  activeMemberCount?:number;
  participants?:Participant[];
}

export interface Participant {
    _id?:string
    userId?: string ;
    type?: string;
    name?: string;
    profile?:string;
    profileUrl?:string;
}

export interface IChat {
    _id?:string;
    name?: string;
    participants?: Participant[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    messages?:IMessage[];
    lastMessage?:IMessage;
    seen?:Seen[];
  }
  
export interface IChatUser{
  _id?:string;
  id:string;
  name:string;
  email:string;
  type?:string,
  profile?:string,
  profileUrl?:string
}

export interface IAvailabeUser{
_id:string,
user_id?:string,
name:string,
email:string,
type:string,
profile:string,
profileUrl?:string
}


export interface EmojiClickData {
  native: string;
}