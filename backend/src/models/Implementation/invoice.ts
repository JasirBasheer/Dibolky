import mongoose, { Schema } from 'mongoose';
import { IInvoice } from '../Interface';

export const invoiceSchema: Schema<IInvoice> = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    agencyId: {
      type: String,
      required: true,
    },
    client: {
      clientId: { type: String,  required: true },
      clientName: { type: String, required: true },
      email: { type: String, required: true },
    },
    service: {
      serviceName: { type: String, required: true },
      details: { type: mongoose.Schema.Types.Mixed, required: true }, 
    },
    pricing: {type: Number, required: true },
    dueDate: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
    },
    orgId: {
      type: String,
      required: true,
    },
    orgName: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
