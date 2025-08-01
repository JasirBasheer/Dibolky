import mongoose, { Document } from "mongoose";

export interface AddressType {
  city: string;
  country: string;
}

export interface IInfluencer extends Document {
  orgId: string;
  organizationName: string;
  name: string;
  email: string;
  address: AddressType;
  websiteUrl: string;
  industry: string;
  password: string;
  contactNumber: number;
  planId: string;
  validity: string;
  logo: string;
  remainingClients?: number;
  isBlocked: boolean;
  planPurchasedRate: number;
  currency?: string;
}

export interface IInfluncerTenant {
  main_id?: string;
  orgId?: string;
  profile: string;
  bio: string;
  organizationName?: string;
  name?: string;
  email?: string;
  paymentCredentials?: {
    razorpay?: {
      key_id?: string;
      key_secret?: string;
    };
    stripe?: {
      key_id?: string;
      key_secret?: string;
    };
  };
  social_credentials?: {
    instagram?: {
      accessToken?: string;
      apiKey?: string;
    };
    facebook?: {
      accessToken?: string;
      apiKey?: string;
    };
    x?: {
      accessToken?: string;
      apiKey?: string;
    };
    linkedin?: {
      accessToken?: string;
      apiKey?: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
  isSocialMediaInitialized?: boolean;
  isPaymentInitialized?: boolean;
}

export interface IInfluncerRegisterPayload {
  organizationName: string;
  name: string;
  email: string;
  address: AddressType;
  websiteUrl: string;
  industry: string;
  contactNumber: number;
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
