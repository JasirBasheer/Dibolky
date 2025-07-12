import { IMenuItems } from "@/types";
import { Document } from "mongoose";

export type BillingCycleTypes = "monthly" | "yearly" ;

export interface IPlan extends Document {
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
