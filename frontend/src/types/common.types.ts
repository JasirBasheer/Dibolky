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

export interface IPlatfroms{
    platfrom:string;
    scheduledDate:string;
}

export interface IContentData{
    files:IFiles[];
    metadata:IMetadata;
    platforms:IPlatfroms[];
    contentType:string;
}