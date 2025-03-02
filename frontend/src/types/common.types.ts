import store from "@/redux/store";
import React from "react";

export interface NavbarProps  {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


export interface IFilesMetaData {
    id:string;
    fileName:string;
    fileType:string;
    fileSize:number;
    contentType:string
}

export interface IFile {
    id:string;
    file:File
    type:string;

}


export interface IFiles{
    fileName:string;
    contentType:string;
    key:string;
    uploadedAt:string;
}

export interface IMetadata{
    caption:string;
    metaAccountId:string
    isScheduled:boolean
    tags?:string[]
}

export interface IPlatforms{
    platform:string;
    scheduledDate?:string | Date;
}

export interface IContentData{
    files:IFiles[];
    metadata:IMetadata;
    platforms:IPlatforms[];
    contentType:string;
}



  
  export interface IMetaAccount{
    pageId:string;
    pageName:string;
    pageImage:string;
  }


  export interface IReviewBucket {
    _id?:string;
    user_id?: string;
    orgId?: string;
    files?: IFiles[];
    status?: string;
    platforms?: IPlatforms[];
    title?: string;
    contentType?:string;
    caption?: string;
    tags?: string[];
    isPublished?: boolean;
    feedBack?: string;
}

export interface Seen {
    userId: string;
    seenAt: string;
  }


export interface IMessage {
    _id?:string;
    chatId: string;
    type: 'text' | 'common';
    senderId?: string;
    senderName?: string;
    text: string;
    fileUrl?: string;
    seen: Seen[];
    createdAt: string;
    updatedAt: string;
  }


  export interface IParticipant {
    userId: string;
    type?: string;
    name?: string;
  }