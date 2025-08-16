import { IMenu } from "@/types";

export interface PlanDetailsDTO {
    _id?:string;
    name: string;
    description: string;
    price: number;
    billingCycle: string;
    maxProjects: number;
    maxClients: number;
    features: string[];
    permissions:string[];
    menu: string[] | IMenu ;
    type: string
}