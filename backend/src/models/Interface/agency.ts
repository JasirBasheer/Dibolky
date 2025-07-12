import { AddressType } from "@/types/agency";
import { Document } from "mongoose";

export interface IAgency extends Document {
    _id: string;
    role?:string;
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    address: AddressType;
    profile?:string;
    bio?:string
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