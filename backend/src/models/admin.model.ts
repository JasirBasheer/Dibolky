import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../types/admin.types';


export const adminSchema: Schema<IAdmin> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export default mongoose.model<IAdmin>('Admin', adminSchema);