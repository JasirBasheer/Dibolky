export interface Seen {
    userId: string;
    seenAt: Date | string;
  }

export interface IMessage {
    _id?:string;
    chatId?: string;  
    type: 'text' | 'common';
    senderId?: string; 
    senderName?: string;
    text: string;
    fileUrl?: string;
    seen: Seen[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}


export interface IChatUser {
    organizationName?: string;
    id: string;
    orgId: string;
    name: string;
  }

export interface ChatItemProps {
  name: string;
  active: boolean;
  onClick: () => void;
  isGroup?: boolean;
  messages: IMessage[];
  userId: string;
}

export interface Participant {
    _id?:string
    userId?: string ;
    type?: string;
    name?: string;
}

export interface IChat {
    _id?:string;
    name?: string;
    participants?: Participant[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    messages?:IMessage[];
    seen?:Seen[];
  }
  
export interface IChatUser{
  _id?:string,
  id:string,
  name:string,
  email:string
}