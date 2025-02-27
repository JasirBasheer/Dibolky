import { Document } from 'mongoose';

interface AddressType {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface IAgencyBase {
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
    currency?: string;
    
}



export interface IAgency extends Document {
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


export interface IOwnerDetailsSchema extends Document {
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




export interface IAgencyOwner extends Document {
    orgId: string;
    planId: string;
    validity?: string;
    organizationName: string;
    name: string;
    email?: string;
    address?: AddressType;
    websiteUrl?:string | null ;
    industry?: string;
    contactNumber?: number;
    logo?: string;
    password?: string;
    remainingProjects?: number;
    remainingClients?: number;
    isBlocked?: boolean;
    planPurchasedRate?: number
}





interface IPlatforms {
    platform: string;
    scheduledDate: string;
    isPublished?: boolean;
    isRescheduled?: boolean;
}


export interface IReviewBucket extends Document {
    user_id?: string;
    orgId: string;
    files: object;
    status: string;
    metaAccountId:string;
    platforms: IPlatforms[];
    title: string;
    contentType:string;
    caption: string;
    tags: string[];
    isPublished?: boolean;
    feedBack: string;
    changePlatformPublishStatus(platform: string, value: boolean): Promise<void>;
}
