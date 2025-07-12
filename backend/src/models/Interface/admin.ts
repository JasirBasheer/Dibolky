import { Document } from "mongoose";

export interface IAdmin extends Document {
    role?:string;
    orgId?:string;
    organizationName?:string;
    name: string;
    email: string;
    password?: string;
    isBlocked?: boolean;
}

