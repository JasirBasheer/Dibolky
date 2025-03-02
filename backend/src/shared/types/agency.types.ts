import { Document } from 'mongoose';

export interface AddressType {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}



export interface IAgency extends Document {
    role?:string;
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    address: AddressType;
    websiteUrl: string;
    industry: string;
    password?: string;
    contactNumber: number;
    planId: string;
    validity: string;
    logo: string;
    remainingClients?: number;
    isBlocked: boolean;
    planPurchasedRate: number;
    currency?:string;
}


export interface IAgencyTenant extends Document {
    ownerId?: string; 
    orgId?: string; 
    planId?: string;
    organizationName?: string;
    name?: string;
    email?: string;
    paymentCredentials?: {
        razorpay?: {
            key_id?: string;
            key_secret?: string;
        };
        stripe?: {
            key_id?: string;
            key_secret?: string;
        };
    };
    socialMedia_credentials?: {
        instagram?: {
            accessToken?: string;
            apiKey?: string;
        };
        facebook?: {
            accessToken?: string;
            apiKey?: string;
        };
        x?: {
            accessToken?: string;
            apiKey?: string;
        };
        tiktok?: {
            accessToken?: string;
            apiKey?: string;
        };
    };
    createdAt?: Date;
    updatedAt?: Date;
    isSocialMediaInitialized?:boolean;
    isPaymentInitialized?:boolean;
    setSocialMediaToken?(provider: string,token: string): Promise<void>;
}





