import { Document } from 'mongoose';

export interface AddressType {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}



export interface IAgency extends Document {
    role?:string;
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    address: AddressType;
    profile?:string;
    bio?:string
    websiteUrl: string;
    industry: string;
    password?: string;
    contactNumber: number;
    planId: string;
    validity: string;
    logo: string;
    remainingClients?: number;
    isBlocked: boolean;
    planPurchasedRate: number;
    currency?:string;

}


export interface IAgencyTenant extends Document {
    main_id?: string; 
    orgId?: string; 
    planId?: string;
    profile?:string;
    bio?:string
    organizationName?: string;
    name?: string;
    email?: string;
    paymentCredentials?: {
        razorpay?: {
            secret_id?: string;
            secret_key?: string;
        };
        stripe?: {
            publish_key?: string;
            secret_key?: string;
            webhook_url?: string;
        };
    };
    socialMedia_credentials?: {
        instagram?: {
            accessToken?: string;
            connectedAt?: string;
        };
        facebook?: {
            accessToken?: string;
            connectedAt?: string;
        };
        x?: {
            accessToken?: string;
            connectedAt?: string;
        };
        tiktok?: {
            accessToken?: string;
            connectedAt?: string;
        };
    };
    createdAt?: Date;
    updatedAt?: Date;
    isSocialMediaInitialized?:boolean;
    isPaymentInitialized?:boolean;
    setSocialMediaToken?(provider: string,token: string): Promise<void>;
    integratePaymentGateway(provider: string,key1:string,key2:string,webhookUrl?:string): Promise<void>;
}





