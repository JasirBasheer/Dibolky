import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin {
    name: string;
    email: string;
    password:string
    
}

const planSchema: Schema<IAdmin> = new Schema({
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

const Admin = mongoose.model<IAdmin>('Admin', planSchema);
export default Admin