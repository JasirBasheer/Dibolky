import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    client: object;
    serviceName: string;
    serviceDetails: object;
    deadLine: Date;
    category: string;
    status: string
}

export const projectSchema: Schema<IProject> = new mongoose.Schema({
    client: {
        type: Object,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceDetails: {
        type: Object
    },
    deadLine: {
        type: Date,
        required:true
    },
    category: {
        type: String,
    },
    status: {
        type: String,
        default:"Pending"
    }
},{timestamps:true})
