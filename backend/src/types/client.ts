import { IMenuCategory } from "./common";

export interface IClientTenantType {
    _id:string;
    orgId?: string;
    main_id?:string;
    name?: string;
    email?: string;
    profile?:string;
    bio?:string;
    industry?: string;
    isSocialMediaInitialized: boolean,
    isPaymentInitialized: boolean,
    createdAt?:string | number;
    updatedAt?:string | number;
}

export interface IClientDetailsType {
    _id:string;
    orgId?: string;
    main_id?:string;
    name?: string;
    email?: string;
    profile?:string;
    bio?:string;
    industry?: string;
    password?: string;
    socialMedia_credentials?: credentials;
    menu?: IMenuCategory;
    isSocialMediaInitialized: boolean,
    isPaymentInitialized: boolean,
    createdAt?:string | number;
    setSocialMediaToken?: (provider: string, token: string) => Promise<void>;
}

interface credentials {
    facebook: platform;
    instagram: platform;
    linkedin: platform;
    x: platform;
}


interface platform {
    accessToken: string;
    connectedAt: string;
}

export interface IClientType  {
    _id:string;
    role?:string;
    orgId?: string;
    organizationName?:string;
    name: string;
    email: string;
    industry: string;
    password: string;
    isBlocked?: boolean;
}



export interface User {
    _id: string;
    name: string;
    type: 'client' | 'agency';
}