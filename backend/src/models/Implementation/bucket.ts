import mongoose, { Schema } from 'mongoose';
import { IBucket } from '../../types/common';




export const bucketSchema: Schema<IBucket> = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    files: [
        {
            fileName: { type: String, required: true },
            contentType: { type: String, required: true },
            key: { type: String, required: true },
            uploadedAt: { type: String, required: true },
        }
    ],
    status: {
        type: String,
        default: "Pending"
    },
    metaAccountId: {
        type: String,
    },
    platforms: [
        {
            platform: {
                type: String,
            },
            scheduledDate: {
                type: String
            },
            status: {
                type: String,
                default: "pending"
            },
        },
    ],
    contentType: {
        type: String,
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
    }
}, { timestamps: true });




bucketSchema.methods.changePlatformPublishStatus = async function (
    platform: string,
    value: boolean
): Promise<void> {
    const platformEntry = this.platforms.find((p: { platform: string }) => p.platform === platform);

    if (platformEntry) {
        platformEntry.status = value;
        await this.save();
    } else {
        throw new Error(`Error while updating scheduled posts: ${platform}`);
    }
};