import mongoose, { Schema, Document } from 'mongoose';


interface addressType {
    city: string;
    country: string;
}

export interface IAgency extends Document {
    orgId: string;
    organizationName: string;
    name: string;
    email: string;
    address: addressType;
    websiteUrl: string;
    industry: string;
    password?: string;
    contactNumber: number;
    planId: string;
    validity: string;
    logo: string;
    remainingClients?: number;
    remainingProjects?: number;
    isBlocked: boolean;
    planPurchasedRate: number;
}



const agencySchema: Schema<IAgency> = new mongoose.Schema({
    orgId: {
        type: String,
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    validity: {
        type: String,
        required: true
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
    contactNumber: {
        type: Number
    },
    logo: {
        type: String
    },
    password: {
        type: String
    },
    remainingProjects: {
        type: Number,
        default: 5
    },
    remainingClients: {
        type: Number,
        default: 5
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    planPurchasedRate: {
        type: Number
    }

});

export default mongoose.model<IAgency>('Agency', agencySchema);


export interface IOwnerDetailsSchema {
    ownerId?: string; 
    orgId?: string; 
    paymentCredentials?: {
        razorpay?: {
            key_id?: string;
            key_secret?: string;
        };
        stripe?: {
            key_id?: string;
            key_secret?: string;
        };
    };
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
    paymentCredentials: {
        razorpay: {
            key_id: {
                type: String,
                required: false,
            },
            key_secret: {
                type: String,
                required: false,
            }
        },
        stripe: {
            key_id: {
                type: String,
                required: false,
            },
            key_secret: {
                type: String,
                required: false,
            }
        }
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
