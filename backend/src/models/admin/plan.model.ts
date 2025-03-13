import mongoose, { Schema } from 'mongoose';
import { IPlan } from '../../types/admin.types';
import { IMenuItems, ISubItem } from '../../types/common.types';

const subItemSchema = new Schema<ISubItem>({
    label: { type: String, required: true },
    icon: { type: String, required: true },
    path: { type: [String], required: true },
}, { _id: false });

const menuItemSchema = new Schema<IMenuItems>({
    label: { type: String, required: true },
    icon: { type: String, required: true },
    subItems: { type: [subItemSchema], required: true },
}, { _id: false });


const planSchema: Schema<IPlan> = new Schema({
    id: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        required: true,
    },
    validity: {
        type: String,
        required: true,
    },
    totalProjects: {
        type: Number,
    },
    totalManagers: {
        type: Number,
    },
    menu: {
        smm: menuItemSchema,
        crm: menuItemSchema,
        accounting: menuItemSchema,
    },
    isActive: {
        type: Boolean,
        default: true

    }
});

export const AgencyPlan = mongoose.model<IPlan>('agencyPlans', planSchema);
export const InfluencerPlan = mongoose.model<IPlan>('influencerPlan', planSchema);