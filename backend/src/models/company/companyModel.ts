import mongoose, { Schema, Document } from 'mongoose';

interface addressType {
    city: string;
    country: string;
}


export interface ICompany extends Document {
    orgId:string;
    organizationName: string;
    name: string;
    email: string;
    address: addressType;
    websiteUrl: string;
    industry: string;
    password: string;
    contactNumber: number;
    logo: string;
}

 const companySchema: Schema<ICompany> = new mongoose.Schema({
    orgId:{
        type:String,
        required:true
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
    password: {
        type: String
    },
    contactNumber: {
        type: Number
    },

    logo: {
        type: String
    }
});


export default mongoose.model<ICompany>('Company', companySchema);
