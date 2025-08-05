import { IMenu } from "@/types";
import { Document } from "mongoose";

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
    instagram?: {
      accessToken?: string;
      refreshToken?: string;
      connectedAt?: string;
    };
    facebook?: {
      accessToken?: string;
      refreshToken?: string;
      connectedAt?: string;
    };
    x?: {
      accessToken?: string;
      refreshToken?: string;
      connectedAt?: string;
    };
    gmail?: {
      accessToken?: string;
      refreshToken?: string;
      connectedAt?: string;
    };
    linkedin?: {
      accessToken?: string;
      refreshToken?: string;
      connectedAt?: string;
    };
  };
  menu: IMenu[];
  isSocialMediaInitialized: boolean;
  isPaymentInitialized: boolean;
  createdAt?: string | number;
  updatedAt?: string | number;
  setSocialMediaToken?: (provider: string, token: string) => Promise<void>;
}
