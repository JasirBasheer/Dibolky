import mongoose, { Schema, Document } from 'mongoose';

export interface IOwnerDetailsSchema {
    ownerId?: string; 
    orgId?: string; 
    socialMedias?: {
        instagram?: {
            accessToken?: string;
            apiKey?: string;
        };
        facebook?: {
            accessToken?: string;
            apiKey?: string;
        };
        x?: {
            accessToken?: string;
            apiKey?: string;
        };
        tiktok?: {
            accessToken?: string;
            apiKey?: string;
        };
    };
    createdAt?: Date;
    updatedAt?: Date;
}


export const ownerDetailsSchema = new Schema<IOwnerDetailsSchema>({
    ownerId: {
        type: String,
        required: false,
    },
    orgId: {
        type: String,
        required: false,
    },
    socialMedias: {
        instagram: {
            accessToken: {
                type: String,
                required: false,
            },
            apiKey: {
                type: String,
                select: false,
            }
        },
        facebook: {
            accessToken: {
                type: String,
                required: false,
            },
            apiKey: {
                type: String,
            }
        },
        x: {
            accessToken: {
                type: String,
                required: false,
            },
            apiKey: {
                type: String,
            },
        },
        tiktok: {
            accessToken: {
                type: String,
                required: false,
            },
            apiKey: {
                type: String,
            },
        },
    },
}, { timestamps: true, });






interface addressType {
    city: string;
    country: string;
}

export interface ICompany extends Document {
    orgId:string;
    organizationName: string;
    name: string;
    email: string;
    address: addressType;
    websiteUrl: string;
    industry: string;
    password: string;
    contactNumber: number;
    logo: string;
    planId:string;
    validity:string;
    isBlocked:boolean;
    remainingProjects:number;
    planPurchasedRate:number;
}

 const companySchema: Schema<ICompany> = new mongoose.Schema({
    orgId:{
        type:String,
        required:true
    },
    organizationName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String
        },
        country: {
            type: String
        }
    },
    websiteUrl: {
        type: String
    },
    industry: {
        type: String
    },
    password: {
        type: String
    },
    contactNumber: {
        type: Number
    },

    logo: {
        type: String
    },
    planId:{
        type:String
    },
    validity:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    remainingProjects:{
        type:Number
    },
    planPurchasedRate:{
        type:Number
    }
});


export default mongoose.model<ICompany>('Company', companySchema);
