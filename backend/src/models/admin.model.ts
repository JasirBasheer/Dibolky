import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../types/admin.types';


const adminSchema: Schema<IAdmin> = new Schema({
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

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin