import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    client: object;
    service_name: string;
    service_details: object;
    dead_line: Date;
    category: string;
    status: string
    createdAt?:string|number;
}

export const projectSchema: Schema<IProject> = new mongoose.Schema({
    client: {
        type: [Schema.Types.Mixed],
        required: true
    },
    service_name: {
        type: String,
        required: true
    },
    service_details: {
        type: Object
    },
    dead_line: {
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