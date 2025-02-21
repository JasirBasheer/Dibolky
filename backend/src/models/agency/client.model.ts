import mongoose, { Schema } from "mongoose";
import { IClient, IClientTenant } from "../../shared/types/client.types";


export const Client: Schema<IClient> = new mongoose.Schema({
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


export default mongoose.model<IClient>('Client', Client);



export const clientSchema: Schema<IClientTenant> = new mongoose.Schema({
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
  services: {
    type: Object,
  },
  menu: {
    type: Object,
    required: true
  }
}, { timestamps: true });


clientSchema.methods.setSocialMediaToken = async function (provider: string, token: string): Promise<void> {
  if (this.socialMedia_credentials.hasOwnProperty(provider)) {
    this.socialMedia_credentials[provider].accessToken = token;
    await this.save();
  } else {
    throw new Error(`Unsupported social media provider: ${provider}`);
  }
};



clientSchema.methods.setSocialMediaUserName = async function (provider: string, username: string): Promise<void> {
  if (this.socialMedia_credentials.hasOwnProperty(provider)) {
    this.socialMedia_credentials[provider].userName = username;
    await this.save();
  } else {
    throw new Error(`Unsupported social media provider: ${provider}`);
  }
};
