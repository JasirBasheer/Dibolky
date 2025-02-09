import mongoose, { Schema } from 'mongoose';


interface IPlatforms {
    platform: string;
    scheduledDate: string;
    isPublished?: boolean;
    isRescheduled?: boolean;
}


export interface IReviewBucket {
    id: string;
    orgId: string;
    url: string[];
    status: string;
    platforms: IPlatforms[];
    contentType: string;
    title: string;
    caption: string;
    tags: string[];
    isPublished?: boolean;
    feedBack: string;
    changePlatformPublishStatus(platform: string, value: boolean): Promise<void>;

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
        type: [String],
        required: true
    },
    status: {
        type: String,
        default: "Pending"  
    },
    platforms: [
        {
            platform: {
                type: String,
            },
            scheduledDate: {
                type: String
            },
            isPublished: {
                type: Boolean,
                default: false
            },
            isRescheduled: {
                type: Boolean,
                default: false
            }
        },
    ],
    contentType: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    caption: {
        type: String
    },
    tags: {
        type: [String]
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    feedBack: {
        type: String
    }
});




ReviewBucketSchema.methods.changePlatformPublishStatus = async function(
    platform: string,
    value: boolean
): Promise<void> {
    const platformEntry = this.platforms.find((p: any) => p.platform === platform);

    if (platformEntry) {
        platformEntry.isPublished = value;
        await this.save();
    } else {
        throw new Error(`Error while updating scheduled posts: ${platform}`);
    }
};