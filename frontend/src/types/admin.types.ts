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

export type validityType = "monthly" | "yearly" | "lifetime";
export type planType = "agency" | "influencer";
export interface IPlan {
    _id?:string;
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
    contactNumber: number;
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
    orgId: string;
    planId?: string
    userId?: string;
    email: string;
    transactionId: string;
    paymentGateway: string;
    amount: number;
    description: string;
    currency: string;
}

export interface IAdminClientData {
    details: Details;
    transactions: Transactions[];
}
