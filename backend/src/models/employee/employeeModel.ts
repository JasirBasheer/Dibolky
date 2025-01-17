import mongoose, { Schema } from 'mongoose';

export interface IEmployee {
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    departmentName: string;
    departmentId: string;
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
    organizationName: {
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
    departmentId: { type: String },
    departmentName: { type: String },
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
