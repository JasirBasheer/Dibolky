import mongoose, { Schema, Document } from 'mongoose';
import { IAgency, IOwnerDetailsSchema } from '../../shared/types/agencyTypes';





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
        tiktok: {
            accessToken: {
                type: String,
                required: false,
            }
        }
    },
}, { timestamps: true, });



ownerDetailsSchema.methods.setSocialMediaToken = async function(provider: string,token: string): Promise<void> {
    if (this.socialMedia_credentials.hasOwnProperty(provider)) {
      this.socialMedia_credentials[provider].accessToken = token;
      await this.save();
    } else {
      throw new Error(`Unsupported social media provider: ${provider}`);
    }
};
  