import mongoose from "mongoose";

export interface AddressType {
    city: string;
    country: string;
}

export interface ICompanyOwner {
    _id: mongoose.Types.ObjectId;
    orgId: string;
    planId: string;
    validity: string;
    organizaitionName: string;
    name: string;
    email: string;
    address: AddressType;
    websiteUrl?: string;
    industry: string;
    contactNumber: number;
    logo?: string;
    password: string;
    remainingProjects: number;
    remainingClients: number;
    isBlocked: boolean;
    planPurchasedRate: number
}


export interface IOwnerDetailsSchema {
    ownerId?: string; 
    orgId?: string; 
    socialMedias?: {
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
