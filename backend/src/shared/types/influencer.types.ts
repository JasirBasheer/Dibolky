import mongoose from "mongoose";

export interface AddressType {
    city: string;
    country: string;
}


export interface IInfluencer extends Document {
    _id?: mongoose.Types.ObjectId | string;
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


export interface IOwnerDetailsSchema {
    ownerId?: string; 
    orgId?: string; 
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
}
