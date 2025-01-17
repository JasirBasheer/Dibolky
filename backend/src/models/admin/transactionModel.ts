import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction {
    orgId: string;
    planId?:string
    email: string;
    transactionId:string;
    paymentGateway:string;
    amount:number;
    description:string;
    userId:string
}

const planSchema: Schema<ITransaction> = new Schema({
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
    }
});

const Transaction = mongoose.model<ITransaction>('transaction', planSchema);
export default Transaction