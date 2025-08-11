import mongoose, { Schema, Document } from 'mongoose';
import { IAgencyTenant } from '../../types/agency';
import { IAgency } from '../Interface/agency';


const agencySchema: Schema<IAgency> = new mongoose.Schema({
    orgId: {
        type: String,
        required: true
    },
    profile:{
        type: String,
        default:""
    },
    bio:{
        type: String,
        default:""
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

},{ timestamps: true });

export default mongoose.model<IAgency>('Agency', agencySchema);





export const agencyTenantSchema = new Schema<IAgencyTenant>({
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
    planId: {
        type: String,
        required: false,
    },
    organizationName: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    paymentCredentials: {
        razorpay: {
            secret_id: {
                type: String,
                required: false,
            },
            secret_key: {
                type: String,
                required: false,
            }
        },
        stripe: {
            publish_key: {
                type: String,
                required: false,
            },
            secret_key: {
                type: String,
                required: false,
            },
            webhook_url: {
                type: String,
                required: false,
            }
        }
    },
    social_credentials: {
        instagram: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
            }
        },
        facebook: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
            }
        },
        meta_ads: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
            }
        },
        google_ads: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
            }
        },
        x: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
            }
        },
        gmail: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
            }
        },
        linkedin: {
            accessToken: {
                type: String,
                required: false,
            },
            refreshToken: {
                type: String,
                required: false,
            },
            connectedAt:{
                type:Date,
                required:false
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
    },
    permissions:{
        type:[String],
        default: []
    }
}, { timestamps: true });



agencyTenantSchema.methods.setSocialMediaToken = async function(provider: string,accessToken: string,refreshToken:string =""): Promise<void> {
    if (this.social_credentials.hasOwnProperty(provider)) {
      this.social_credentials[provider].accessToken = accessToken;
      this.social_credentials[provider].refreshToken = refreshToken;
      this.social_credentials[provider].connectedAt = Date.now()
      await this.save();
    } else {
      throw new Error(`Unsupported social media provider: ${provider}`);
    }
};
  
agencyTenantSchema.methods.integratePaymentGateway = async function(provider: string,key1:string,key2:string,webhookUrl?:string): Promise<void> {
    if (this.paymentCredentials.hasOwnProperty(provider)) {
        if(provider == "razorpay"){
            this.paymentCredentials[provider].secret_id = key1;
            this.paymentCredentials[provider].secret_key = key2;
        }else{
            this.paymentCredentials[provider].publish_key = key1;
            this.paymentCredentials[provider].secret_key = key2; 
            this.paymentCredentials[provider].webhook_url = webhookUrl; 
        }
      await this.save();
    } else {
      throw new Error(`Unsupported payment provider: ${provider}`);
    }
};
  