import { Document } from "mongoose";

export interface ITransaction extends Document {
    orgId: string;
    planId?: string
    userId?: string;
    email: string;
    transactionId: string;
    paymentGateway: string;
    amount: number;
    description: string;
    currency: string;
    transactionType:string;
}