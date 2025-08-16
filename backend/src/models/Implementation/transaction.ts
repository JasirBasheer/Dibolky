// models/Implementation/transaction.ts
import mongoose, { Schema, Model } from 'mongoose';
import { ITransaction } from '../Interface';

const transactionSchema: Schema<ITransaction> = new Schema({
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
        default: "razorpay"
    },
    transactionType:{
        type: String,
    },
    transactionId: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);
export { transactionSchema, TransactionModel };