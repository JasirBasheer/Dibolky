import { Document, Types } from "mongoose";

export interface IClientTenant extends Document {
    orgId?: string;
    name?: string;
    email?: string;
    industry?: string;
    password?: string;
    socialMedia_credentials?: credentials;
    services?: any;
    menu?: any;
    isSocialMediaInitialized: boolean,
    isPaymentInitialized: boolean,
    setSocialMediaToken?: (provider: string, token: string) => Promise<void>;
    setSocialMediaUserName?: (provider: string, username: string) => Promise<void>;

}

interface credentials {
    facebook: platform;
    instagram: platform;
    tiktok: platform;
    x: platform;
}


interface platform {
    accessToken: string;
    userName: string;
}

export interface IClient extends Document {
    orgId: string;
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