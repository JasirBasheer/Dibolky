import mongoose, { Schema } from 'mongoose';
import { IEmployee } from '../../shared/types/employee.types';


export const employeeSchema: Schema<IEmployee> = new Schema({
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
