import mongoose, { Schema, Document } from 'mongoose';
import { IInfluencer, IInfluncerTenant } from '../types/influencer';


export const influencerSchema: Schema<IInfluencer> = new mongoose.Schema({
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
    },
    currency:{
        type:String
    }

});

export default mongoose.model<IInfluencer>('Influencer', influencerSchema);





export const influencerTenantSchema = new Schema<IInfluncerTenant>({
    main_id: {
        type: String,
        required: false,
    },
    orgId: {
        type: String,
        required: false,
    },
    profile:{
        type: String,
        default:""
    },
    bio:{
        type: String,
        default:""
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
    socialMedia_credentials: {
        instagram: {
            accessToken: {
                type: String,
                required: false,
            }
        },
        facebook: {
            accessToken: {
                type: String,
                required: false,
            }
        },
        x: {
            accessToken: {
                type: String,
                required: false,
            }
        },
        linkedin: {
            accessToken: {
                type: String,
                required: false,
            }
        }
    },
    isSocialMediaInitialized: {
        type: Boolean,
        default : false
    },
    isPaymentInitialized: {
        type: Boolean,
        default : false
    }
}, { timestamps: true });



influencerTenantSchema.methods.setSocialMediaToken = async function(provider: string,token: string): Promise<void> {
    if (this.socialMedia_credentials.hasOwnProperty(provider)) {
      this.socialMedia_credentials[provider].accessToken = token;
      await this.save();
    } else {
      throw new Error(`Unsupported social media provider: ${provider}`);
    }
};
  