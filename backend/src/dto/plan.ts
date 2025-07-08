import { IMenuCategory } from "@/types/common";

export interface PlanDetailsDTO {
    name: string;
    description: string;
    price: number;
    billingCycle: string;
    maxProjects: number;
    maxClients: number;
    features: string[];
    permissions:string[];
    menu: IMenuCategory | string[];
}