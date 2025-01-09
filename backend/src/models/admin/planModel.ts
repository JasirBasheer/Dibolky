import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
    planName: string;
    price: string;
    features: string;
    validity: string;
}

const planSchema: Schema<IPlan> = new mongoose.Schema({
    planName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    features: {
        type: String,
        required: true
    },
    validity: {
        type: String,
        required: true
    }
});

export default mongoose.model<IPlan>('Plan', planSchema);
