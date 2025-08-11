import { 
    model, 
    Schema 
} from 'mongoose';
import { IPlan } from '../Interface/plan';
import { IMenu, Item } from '@/types';

const subItemSchema = new Schema<Item>({
    title: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    },
}, { _id: false });

const menuItemSchema = new Schema<IMenu>({
    title: { 
        type: String, 
        required: true
    },
    icon: { 
        type: String, 
        required: true 
    },
    items: { 
        type: [subItemSchema], 
        required: true
     },
}, { _id: false });


const planSchema: Schema<IPlan> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        description:{
            type:String,
            required:true,
        },
        price: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        features: { 
            type: [String], 
            required: true 
        },
        billingCycle: {
            type: String,
            required: true,
            enum: ["monthly", "yearly"],
        },
        maxProjects: { 
            type: Number
        },
        maxClients: { 
            type: Number
        },
        menu: { 
            type: [menuItemSchema], 
            required:true
        },
        isActive: { 
            type: Boolean, 
            default: true 
        },
        permissions:{
            type: [String],
            required:true
        }
    },
    { timestamps: true }
);

export const Plan = model<IPlan>("Plan", planSchema);
