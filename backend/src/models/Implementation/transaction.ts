import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../Interface';


export const transactionSchema: Schema<ITransaction> = new Schema({
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
        type:String,
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
},{timestamps:true});

const Transaction = mongoose.model<ITransaction>('transaction', transactionSchema);
export default Transaction