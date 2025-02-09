import mongoose, { Schema, Document } from 'mongoose';

export interface ISubItem {
    label: string;
    icon: string;
    path: string[];
}

export interface IMenuItem {
    label: string;
    icon: string;
    subItems: ISubItem[];
}

export interface IPlan extends Document {
    id?: number;
    title: string;
    price: number;
    features: string[];
    validity: string;
    menu?: {
        smm?: IMenuItem;
        crm?: IMenuItem;
        accounting?: IMenuItem;
    };
}

const subItemSchema = new Schema<ISubItem>({
    label: { type: String, required: true },
    icon: { type: String, required: true },
    path: { type: [String], required: true },
}, { _id: false });

const menuItemSchema = new Schema<IMenuItem>({
    label: { type: String, required: true },
    icon: { type: String, required: true },
    subItems: { type: [subItemSchema], required: true },
},{ _id: false });

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
    menu: {
        smm: menuItemSchema,
        crm: menuItemSchema,
        accounting: menuItemSchema,
    },
});

export const AgencyPlan = mongoose.model<IPlan>('agencyPlans', planSchema);
export const CompanyPlan = mongoose.model<IPlan>('companyPlans', planSchema);
