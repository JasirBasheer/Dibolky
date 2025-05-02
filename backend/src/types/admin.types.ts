import mongoose, { Document } from "mongoose";
import { IMenuCategory, IMenuItems } from "./common.types";



export interface IAdmin extends Document {
    role?:string;
    orgId?:string;
    organizationName?:string;
    name: string;
    email: string;
    password: string;
    isBlocked?: boolean;
}


export interface planDetails {
    _id?:mongoose.ObjectId,
    planName: string;
    planType: string;
    description: string;
    price: number;
    validity: string;
    features: string[];
    permissions:string[];
    menu: IMenuCategory | string[];
}

export type validityType = "monthly" | "yearly" | "lifetime";
export type planType = "agency" | "influencer";

export interface IPlan extends Document {
    planName: string;
    planType:planType;
    planDescription:string;
    price: number;
    features: string[];
    validity:  validityType;
    totalProjects?: number;
    totalManagers?: number;
    menu?: {
        smm?: IMenuItems;
        crm?: IMenuItems;
        accounting?: IMenuItems;
    };
    isActive:boolean;
    deactivationDate:Date;
    permissions:string[]
}


export interface Plans {
    [key: string]: IPlan[]; 
}