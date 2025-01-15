import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
    orgId: string;
    name: string;
    email: string;
    industry:string;
    password: string;
    socialMedia_credentials?:credentials
}
interface credentials{
    facebook:string;
    instagram:string;
    tiktok:string;
    x:string;
}
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
    industry:{
        type:String,
    },
    socialMedia_credentials:{
        facebook:{
            type:String
        },
        instagram:{
            type:String
        },
        tiktok:{
            type:String
        },
        x:{
            type:String
        }
    }, 
    password: {
        type: String,
        required: true
    }
});

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