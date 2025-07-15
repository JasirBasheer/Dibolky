import { Document } from "mongoose";
import { INote } from "./note";

export interface User {
    _id: string;
    name: string;
    type: 'client' | 'employee';
}


export interface IMetaAccount {
    pageId: string;
    pageName: string;
    pageImage: string;
}

export interface ISocialMediaUploadResponse {
    name: string;
    status: string;
    id: string;
}

export interface IPlatforms {
    platform: string;
    scheduledDate: string;
    status: string;
}
export interface IFiles {
    fileName: string;
    contentType: string;
    key: string;
    uploadedAt: string;
}


export interface IBucket extends Document {
    user_id?: string;
    orgId: string;
    files: IFiles[];
    status: string;
    metaAccountId: string;
    platforms: IPlatforms[];
    title: string;
    contentType: string;
    caption: string;
    tags: string[];
    isPublished?: boolean;
    reason?:INote | null;
    changePlatformPublishStatus(platform: string, value: boolean): Promise<void>;
}




interface Category {
    id: string;
    name: string;
}

export interface SocialMediaPage {
    access_token: string;
    category: string;
    category_list: Category[];
    name: string;
    id: string;
    tasks: string[];
    instagram_business_account:string
}

export interface SocialMediaResponse {
    data: SocialMediaPage[];
    
}


export interface ITokenDetails {
    id: string;
    role: string;
    iat: number;
    exp: number;
}


export interface IReelUploadStatus {
    status: {
        video_status: string;
        uploading_phase: {
            status: string;
            bytes_transferred: number;
        };
        processing_phase: {
            status: string;
        };
        publishing_phase: {
            status: string;
        };
        copyright_check_status: {
            status: string;
        };
    };
    id: string;
}

export interface Item {
    title: string;
    url: string;
}

export interface IMenu {
    title: string;
    icon: string;
    items: Item[];
}




export interface IMetadata{
    caption:string;
    title:string;
    metaAccountId:string
    isScheduled:boolean
    tags?:string[]
}



export interface IUpdateProfile{
    tenant_id?:string,
    main_id?:string,
    profile: string,
    name:string,
    bio:string,
}



export interface IIntegratePaymentType {
    key1:string;
    key2:string;
    webhookUrl?:string
  }





  // socail integrations

 export interface credentials {
    facebook: platform;
    instagram: platform;
    linkedin: platform;
    x: platform;
}


export interface platform {
    accessToken: string;
    connectedAt: string;
}
