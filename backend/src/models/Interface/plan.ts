import { IMenu } from "@/types";
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
    menu: IMenu[]
    isActive:boolean;
    permissions:string[]
    createdAt: Date
    type: string
}
