import mongoose, { Schema } from "mongoose";
import { IClient, IClientTenant } from "../types/client.types";


export const clientSchema: Schema<IClient> = new mongoose.Schema({
  orgId: {
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
  password: {
    type: String,
    required: true
  }
});


export default mongoose.model<IClient>('Client', clientSchema);



export const clientTenantSchema: Schema<IClientTenant> = new mongoose.Schema({
  main_id:{
    type:String,
    required:true
  },
  orgId: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  industry: {
    type: String,
  },

  socialMedia_credentials: {
    facebook: {
      accessToken: {
        type: String,
        required: false,
        default: ""
      },
      userName: {
        type: String,
        required: false,
        default: ""
      }
    },
    instagram: {
      accessToken: {
        type: String,
        required: false,
        default: ""
      },
      userName: {
        type: String,
        required: false,
        default: ""
      }
    },
    tiktok: {
      accessToken: {
        type: String,
        required: false,
        default: ""
      }
    },
    x: {
      accessToken: {
        type: String,
        required: false,
        default: ""
      }
    }
  },
  menu: {
    type: Object,
    required: true
  },
  isSocialMediaInitialized: {
    type: Boolean,
    default: false
  },
  isPaymentInitialized: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


clientTenantSchema.methods.setSocialMediaToken = async function (provider: string, token: string): Promise<void> {
  if (this.socialMedia_credentials.hasOwnProperty(provider)) {
    this.socialMedia_credentials[provider].accessToken = token;
    await this.save();
  } else {
    throw new Error(`Unsupported social media provider: ${provider}`);
  }
};



