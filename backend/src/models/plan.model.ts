import { IPlan } from '../types/admin.types';
import { 
    model, 
    Schema 
} from 'mongoose';
import { 
    IMenuItems, 
    ISubItem 
} from '../types/common.types';

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
        planName: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        planType: {
            type: String,
            required: true,
            enum: ["agency", "influencer"],
        },
        planDescription:{
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
        validity: {
            type: String,
            required: true,
            enum: ["monthly", "yearly", "lifetime"],
        },
        totalProjects: { 
            type: Number
        },
        totalManagers: { 
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
        deactivationDate: { 
            type: Date, 
            default: null 
        },
        permissions:{
            type: [String],
            required:true
        }
    },
    { timestamps: true }
);

export const Plan = model<IPlan>("Plan", planSchema);
