import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../Interface/admin';


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

export default mongoose.model<IAdmin>('Admin', adminSchema);