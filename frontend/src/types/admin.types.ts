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



export interface ISubItem {
    label: string;
    icon: string;
    path: string[];
}

export interface IMenuItems {
    label: string;
    icon: string;
    subItems: ISubItem[];
}

export type validityType = "monthly" | "yearly" ;
export interface IPlan {
    _id?:string;
    name: string;
    description:string;
    price: number;
    type: string;
    features: string[];
    billingCycle:  validityType;
    maxProjects?: number;
    maxClients?: number;
    menu?: {
        smm?: IMenuItems;
        crm?: IMenuItems;
        accounting?: IMenuItems;
    };
    isActive:boolean;
    createdAt?: string;
}



export interface IPlans {
    [key: string]: IPlan[]; 
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
