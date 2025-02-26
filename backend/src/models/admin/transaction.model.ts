import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    orgId: string;
    planId?:string
    userId?:string;
    email: string;
    transactionId:string;
    paymentGateway:string;
    amount:number;
    description:string;
    currency:string;
}

export const transactionSchema: Schema<ITransaction> = new Schema({
    orgId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userId:{type:String},
    planId: {
        type: String,
    },
    paymentGateway:{
        type:String,
        default:"razorpay"
    },
    transactionId:{
        type:String
    },
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    currency:{
        type:String,
        required:true
    }
});

const Transaction = mongoose.model<ITransaction>('transaction', transactionSchema);
export default Transaction