import mongoose from "mongoose";

interface AddressType {
    city: string;
    country: string;
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
    remainingProjects?: number;
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
}




export interface IAgencyOwner {
    _id: mongoose.Types.ObjectId;
    orgId: string;
    planId: string;
    validity: string;
    organizationName: string;
    name: string;
    email: string;
    address: AddressType;
    websiteUrl?:string | null ;
    industry: string;
    contactNumber: number;
    logo?: string;
    password: string;
    remainingProjects: number;
    remainingClients: number;
    isBlocked: boolean;
    planPurchasedRate: number
}