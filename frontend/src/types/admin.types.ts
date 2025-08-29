import { Plan } from "./plan";

export interface PlanConsumer {
    name: string;
    organizationName: string;
    validity: string | Date; 
    industry: string;
  }
  
export interface IAdminPlan {
    _id: string;
    title: string;
    description: string;
    price: number;
    validity: string;
    features: string[];
    menu: string[];
    isActive: boolean;
    planConsumers: PlanConsumer[];
  }






export interface IPlans {
    [key: string]: Plan[]; 
}



interface Address {
    city: string;
    country: string;
}

interface Details {
    address: Address;
    _id: string;
    orgId: string;
    planId: string;
    validity: string; 
    organizationName: string;
    name: string;
    email: string;
    industry: string;
    contactNumber: string;
    logo: string;
    password: string;
    remainingClients: number;
    isBlocked: boolean;
    planPurchasedRate: number;
    currency: string;
    __v: number;
    createdAt:string;
    updatedAt:string
}

export interface Transactions {
    id?:string;
    orgId: string;
    planId?: string
    userId?: string;
    email: string;
    transactionId: string;
    paymentGateway: string;
    amount: number;
    description: string;
    currency: string;
    createdAt: string
}

export interface IAdminClientData {
    details: Details;
    transactions: Transactions[];
}
