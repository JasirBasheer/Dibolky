import { Document } from "mongoose";

export interface AddressType {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface IAgencyType {
  _id: string;
  role?: string;
  orgId: string;
  organizationName: string;
  name: string;
  email: string;
  address: AddressType;
  profile?: string;
  bio?: string;
  websiteUrl: string;
  industry: string;
  password?: string;
  contactNumber: string;
  planId: string;
  validity: string;
  logo: string;
  remainingClients?: number;
  isBlocked: boolean;
  planPurchasedRate: number;
  currency?: string;
  createdAt?: Date;
}

interface credentials {
  accessToken?: string;
  refreshToken?: string;
  connectedAt?: string;
}

export interface IAgencyTenant extends Document {
  main_id?: string;
  orgId?: string;
  planId?: string;
  profile?: string;
  bio?: string;
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
  social_credentials?: {
    instagram?: credentials;
    facebook?: credentials;
    x?: credentials;
    gmail?: credentials;
    linkedin?: credentials;
    google_ads?: credentials;
    meta_ads?: credentials;
  };
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isSocialMediaInitialized?: boolean;
  isPaymentInitialized?: boolean;
  setSocialMediaToken?(
    provider: string,
    accesstoken: string,
    refreshtoken?: string
  ): Promise<void>;
  integratePaymentGateway(
    provider: string,
    key1: string,
    key2: string,
    webhookUrl?: string
  ): Promise<void>;
}

export interface IAgencyRegistrationPayload {
  organizationName: string;
  name: string;
  email: string;
  address: AddressType;
  websiteUrl: string;
  industry: string;
  contactNumber: string;
  logo: string;
  password: string;
  planId: string;
  validity: number;
  planPurchasedRate: number;
  transactionId: string;
  paymentGateway: string;
  description: string;
  currency: string;
}
