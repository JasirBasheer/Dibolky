import { IMenu } from "./common";

export type BillingCycleTypes = "monthly" | "yearly" ;

export interface IPlanType {
    _id: string;
    name: string;
    description:string;
    price: number;
    features: string[];
    billingCycle:  BillingCycleTypes;
    maxProjects: number;
    maxClients: number;
    menu?: IMenu[]
    isActive:boolean;
    permissions:string[]
}
