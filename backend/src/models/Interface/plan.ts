import { IMenu } from "@/types";

export type BillingCycleTypes = "monthly" | "yearly" ;
export interface Plan {
    id?: string;
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
