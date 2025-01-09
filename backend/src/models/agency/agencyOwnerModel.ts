import mongoose, { Schema, Document } from 'mongoose';

interface addressType {
    place: string;
    street: string;
    pinCode: string;
}

export interface IAgency extends Document {
    orgId:string;
    agencyName: string;
    ownerName: string;
    email: string;
    address: addressType;
    websiteUrl: string;
    industry: string;
    password: string;
    contactNumber: number;
    platformEmail: string;
    logo: string;
}

const agencySchema: Schema<IAgency> = new mongoose.Schema({
    orgId:{
        type:String,
        required:true
    },
    agencyName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        place: {
            type: String
        },
        street: {
            type: String
        },
        pinCode: {
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
    platformEmail: {
        type: String
    },
    logo: {
        type: String
    }
});

export default mongoose.model<IAgency>('Agency', agencySchema);