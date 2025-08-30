import { AddressType } from "@/types/agency";
import { Document, Types } from "mongoose";

export interface IAgency extends Document {
    _id: any;
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
    contactNumber: string;
    planId: string;
    validity: string;
    logo: string;
    remainingClients: number;
    remainingProjects: number;
    isBlocked: boolean;
    planPurchasedRate: number;
    currency?:string;
    createdAt?:Date
    updatedAt?:Date
}