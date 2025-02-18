import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
    department: string;
    permissions: string[];
    menu: any
}

export const departmentSchema: Schema<IDepartment> = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    permissions: {
        type: [String],
        required: true
    },
    menu: { type: Object }
});
