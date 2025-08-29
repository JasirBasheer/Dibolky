import { IMenu } from "./plan";

export interface IClient {
    _id?:string;
    role?:string;
    orgId: string;
    organizationName?:string;
    name: string;
    email: string;
    industry: string;
    password: string;
    isBlocked?: boolean;
    planPurchasedRate:number
    validity: string;
    profile: string;
    address:{
        country: string;
        city: string
    }
    createdAt: string
}

interface platform {
    accessToken: string;
    userName: string;
}

interface credentials {
    facebook: platform;
    instagram: platform;
    linkedin: platform;
    x: platform;
}


export interface IMenuCategory {
    [key: string]: IMenu ;
}

export interface IClientTenant  {
    _id?:string;
    orgId?: string;
    name?: string;
    email?: string;
    industry?: string;
    password?: string;
    social_credentials?: credentials;
    menu?: IMenuCategory;
    isSocialMediaInitialized: boolean,
    isPaymentInitialized: boolean,
    createdAt?:string | number;
    projects?:any[]
}


export interface MenuItem {
    label: string;
    icon: string;
    path?: string[]; 
    subItems?: MenuItem[]; 
  }
  
export interface MenuData {
    [key: string]: MenuItem; 
  }
  