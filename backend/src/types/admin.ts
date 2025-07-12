import mongoose, { Document } from "mongoose";
import {  IMenuItems } from "./common";



export interface IAdminType {
    _id: string;
    role?:string;
    orgId?:string;
    organizationName?:string;
    name: string;
    email: string;
    password?: string;
    isBlocked?: boolean;
}


export type BillingCycleTypes = "monthly" | "yearly" ;

export interface IPlanType extends Document {
    name: string;
    description:string;
    price: number;
    features: string[];
    billingCycle:  BillingCycleTypes;
    maxProjects: number;
    maxClients: number;
    menu?: {
        smm?: IMenuItems;
        crm?: IMenuItems;
        accounting?: IMenuItems;
    };
    isActive:boolean;
    permissions:string[]
}


export interface Plans {
    [key: string]: IPlanType[]; 
}