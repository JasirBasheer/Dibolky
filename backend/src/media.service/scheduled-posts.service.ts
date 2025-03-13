import cron from 'node-cron';
import { color } from 'console-log-colors';
import Agencies from '../models/agency/agency.model';
import { connectTenantDB } from '../config/db.config';
import { ReviewBucketSchema } from '../models/agency/review-bucket.model';
import { container } from 'tsyringe';
import { Types } from 'mongoose';
import { IProviderService } from '../services/Interface/IProviderService';
import { IClientService } from '../services/Interface/IClientService';
import { IAgencyService } from '../services/Interface/IAgencyService';
import { IClientTenant } from '../types/client.types';
import { IAgencyTenant } from '../types/agency.types';
import {
    IPlatforms,
    IReviewBucket,
    ISocialMediaUploadResponse
} from '../types/common.types';


// services
const providerService = container.resolve<IProviderService>('ProviderService');
const clientService = container.resolve<IClientService>("ClientService");
const agencyService = container.resolve<IAgencyService>("AgencyService");

async function processAgencyScheduledPosts() {
    try {
        const now = new Date();
        const endTime = new Date(now.getTime() + 5 * 60 * 1000);

        let agencies = await Agencies.find()

        for (let agency of agencies) {
            let db = await connectTenantDB(agency.orgId)
            const reviewBucket = db.model('reviewBucket', ReviewBucketSchema)
            const scheduledContents = await reviewBucket.find({
                status: "Approved",
                isPublished: false
            })


            const filteredContents = scheduledContents.filter((content) => {
                const validPlatforms = content.platforms.filter((platform) => {
                    return !platform.isPublished && platform.scheduledDate !== '' && new Date(platform.scheduledDate).getTime() >= now.getTime() && new Date(platform.scheduledDate).getTime() <= endTime.getTime();
                })
                return validPlatforms.length > 0;
            })


            const filteredScheduledContents: (Partial<IReviewBucket> & Partial<{ platforms: IPlatforms[] }>)[] = filteredContents.map((content) => {
                const validPlatforms = content.platforms.filter((platform) => {
                    return !platform.isPublished && platform.scheduledDate !== '' && new Date(platform.scheduledDate).getTime() >= now.getTime() && new Date(platform.scheduledDate).getTime() <= endTime.getTime();
                }) ?? [];

                return {
                    ...content.toObject(),
                    platforms: validPlatforms
                };
            }) ?? [];


            for (let content of filteredScheduledContents) {
                if ((content.platforms ?? []).length > 0) {
                    let user: IAgencyTenant | IClientTenant | null = await clientService.getClientTenantDetailsById(agency.orgId, content?.user_id as string)
                    if (!user) {
                        user = await agencyService.getAgencyOwnerDetails(agency.orgId)
                    }
                    const result: ISocialMediaUploadResponse[] = await providerService.handleSocialMediaUploads(content as IReviewBucket, user, true)
                    if (result) {
                        for (let platform of result) {

                            const reviewBucket = db.model('reviewBucket', ReviewBucketSchema)
                            let content = await reviewBucket.findOne({ _id: new Types.ObjectId(platform.id) })
                            if (content) {
                                await content.changePlatformPublishStatus(String(platform.name), true);
                            }
                        }
                    }

                }
            }

        }

    } catch (error) {
        console.error('Error processing scheduled posts:', error);
    }
}


export function startScheduledPostsProcessor() {
    cron.schedule('*/2 * * * *', async () => {
        console.log(color.blue('✅ Cron job restarted for scheduled contents...'));
        await processAgencyScheduledPosts();
    });
}





