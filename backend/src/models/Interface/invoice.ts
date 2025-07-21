import { Document } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  agencyId: string;
  client: {
    clientId: string;
    clientName: string;
    email: string;
  };
  service: {
    serviceName: string;
    details: object;
  };
  pricing: number;
  dueDate: Date;
  isPaid: boolean; 
  orgId: string;
  orgName:string;
  paidDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}