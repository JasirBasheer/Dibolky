import { Schema } from "mongoose";

export interface IEmployee {
    _id?:any;
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    department: Schema.Types.ObjectId | string;
    password: string;
    contactNumber: number;
    profile: string;
    isBlocked: boolean;
}

