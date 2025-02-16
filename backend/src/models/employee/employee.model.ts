import mongoose, { Schema } from 'mongoose';

export interface IEmployee {
    _id?:any;
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    department: string;
    password: string;
    contactNumber: number;
    profile: string;
    isBlocked: boolean;
}



export const employeeSchema: Schema<IEmployee> = new mongoose.Schema({
    orgId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    department: { type: String },
    contactNumber: {
        type: Number
    },
    profile: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
});


export default mongoose.model<IEmployee>('Employee', employeeSchema);
