import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewBucket extends Document {
    id: string;
    orgId: string;
    url: string;
    status: string;
    platform: string[];
    contentType: string;
    title:string;
    caption:string;
    tags:string[];
    isScheduled:boolean;
    scheduledDate:string;

}

export const ReviewBucketSchema: Schema<IReviewBucket> = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default :"Pending"
    },
    platform: {
        type: [String],
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    title:{
        type:String
    },
    caption:{
        type:String
    },
    tags:{
        type:[String]
    },
    isScheduled:{
        type:Boolean
    },
    scheduledDate:{
        type:String
    }
});
