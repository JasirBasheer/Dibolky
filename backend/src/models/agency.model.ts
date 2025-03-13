import mongoose, { Schema, Document } from 'mongoose';
import { IAgency, IAgencyTenant } from '../types/agency.types';


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

});

export default mongoose.model<IAgency>('Agency', agencySchema);





export const ownerDetailsSchema = new Schema<IAgencyTenant>({
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
    socialMedia_credentials: {
        instagram: {
            accessToken: {
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
            connectedAt:{
                type:Date,
                required:false
            }
        },
        tiktok: {
            accessToken: {
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
    }
}, { timestamps: true });



ownerDetailsSchema.methods.setSocialMediaToken = async function(provider: string,token: string): Promise<void> {
    if (this.socialMedia_credentials.hasOwnProperty(provider)) {
      this.socialMedia_credentials[provider].accessToken = token;
      this.socialMedia_credentials[provider].connectedAt = Date.now()
      await this.save();
    } else {
      throw new Error(`Unsupported social media provider: ${provider}`);
    }
};
  
ownerDetailsSchema.methods.integratePaymentGateway = async function(provider: string,key1:string,key2:string,webhookUrl?:string): Promise<void> {
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
  