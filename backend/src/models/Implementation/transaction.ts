import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import { Transaction } from "../Interface";


export type TransactionDoc = HydratedDocument<Transaction>;

const transactionSchema: Schema<TransactionDoc> = new Schema(
  {
    orgId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userId: { type: String },
    planId: {
      type: String,
    },
    paymentGateway: {
      type: String,
      default: "razorpay",
    },
    transactionType: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ userId: 1, createdAt: -1 });

const TransactionModel: Model<TransactionDoc> = mongoose.model<TransactionDoc>(
  "Transaction",
  transactionSchema
);

export { transactionSchema, TransactionModel };
