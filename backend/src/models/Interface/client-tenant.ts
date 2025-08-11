import { IMenu } from "@/types";
import { Document } from "mongoose";

interface credentials {
  accessToken?: string;
  refreshToken?: string;
  connectedAt?: string;
}

export interface IClientTenant extends Document {
  orgId?: string;
  main_id?: string;
  name?: string;
  email?: string;
  profile?: string;
  bio?: string;
  industry?: string;
  password?: string;
  social_credentials?: {
    instagram?: credentials;
    facebook?: credentials;
    x?: credentials;
    gmail?: credentials;
    linkedin?: credentials;
    meta_ads?: credentials;
    google_ads?: credentials;
  };
  menu: IMenu[];
  isSocialMediaInitialized: boolean;
  isPaymentInitialized: boolean;
  createdAt?: string | number;
  updatedAt?: string | number;
  setSocialMediaToken?: (provider: string, token: string) => Promise<void>;
}
