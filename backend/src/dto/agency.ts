import { AddressType } from "@/types/agency";

export interface IAgencyRegistrationDto {
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