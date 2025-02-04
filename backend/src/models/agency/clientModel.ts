import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  orgId: string;
  name: string;
  email: string;
  industry: string;
  password?: string;
  socialMedia_credentials?: credentials;
  services?: any;
  menu?: any;
}
interface credentials {
  facebook: platform;
  instagram: platform;
  tiktok: platform;
  x: platform;
}
interface platform {
  accessToken: string;
  userName: string;
}



//Model for Main DB
export const clientMainDbSchema: Schema<IClient> = new mongoose.Schema({
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


export default mongoose.model<IClient>('Client', clientMainDbSchema);




//Model for tenant DB
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
    required: true
  },
  menu: {
    type: Object,
    required: true
  }
})


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
