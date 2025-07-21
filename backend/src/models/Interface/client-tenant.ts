import { credentials, IMenu,  } from "@/types";
import { Document } from "mongoose";


export interface IClientTenant extends Document {
    orgId?: string;
    main_id?:string;
    name?: string;
    email?: string;
    profile?:string;
    bio?:string;
    industry?: string;
    password?: string;
    socialMedia_credentials?: credentials;
    menu: IMenu[];
    isSocialMediaInitialized: boolean,
    isPaymentInitialized: boolean,
    createdAt?:string | number;
    updatedAt?:string | number;
    setSocialMediaToken?: (provider: string, token: string) => Promise<void>;
}