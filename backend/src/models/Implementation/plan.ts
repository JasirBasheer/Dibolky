import { 
    model, 
    Schema 
} from 'mongoose';
import { 
    IMenuItems, 
    ISubItem 
} from '../../types/common';
import { IPlan } from '../Interface/plan';

const subItemSchema = new Schema<ISubItem>({
    label: { 
        type: String, 
        required: true 
    },
    icon: { 
        type: String, 
        required: true 
    },
    path: { 
        type: [String], 
        required: true 
    },
}, { _id: false });

const menuItemSchema = new Schema<IMenuItems>({
    label: { 
        type: String, 
        required: true
    },
    icon: { 
        type: String, 
        required: true 
    },
    subItems: { 
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
            requried:true,
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
            smm: { 
                type: menuItemSchema
            },
            crm: {
                 type: menuItemSchema, 
            },
            accounting: { 
                type: menuItemSchema, 
            },
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
