import cron from 'node-cron';
import { color } from 'console-log-colors';
import Agencies from '../../models/Implementation/agency';
import { connectTenantDB } from '../../config/db.config';
import { bucketSchema } from '../../models/Implementation/bucket';
import { container } from 'tsyringe';
import { Types } from 'mongoose';
import { IProviderService } from '../../services/Interface/IProviderService';
import { IClientService } from '../../services/Interface/IClientService';
import { IAgencyService } from '../../services/Interface/IAgencyService';
import { IAgencyTenant } from '../../types/agency';
import {
    IPlatforms,
    IBucket,
    ISocialMediaUploadResponse
} from '@/types/';
import logger from '@/logger';
import { IClientTenant } from '@/models';



async function processAgencyScheduledPosts() {
    try {
        const clientService = container.resolve<IClientService>("ClientService");
        const agencyService = container.resolve<IAgencyService>("AgencyService");
        const providerService = container.resolve<IProviderService>('ProviderService');


        const now = new Date();
        const endTime = new Date(now.getTime() + 5 * 60 * 1000);

        let agencies = await Agencies.find()

        for (let agency of agencies) {
            let db = await connectTenantDB(agency.orgId)
            const reviewBucket = db.model('reviewBucket', bucketSchema)
            const scheduledContents = await reviewBucket.find({
                status: "Approved",
                isPublished: false
            })


            const filteredContents = scheduledContents.filter((content) => {
                const validPlatforms = content.platforms.filter((platform) => {
                    return platform.status == "pending" && platform.scheduledDate !== '' && new Date(platform.scheduledDate).getTime() >= now.getTime() && new Date(platform.scheduledDate).getTime() <= endTime.getTime();
                })
                return validPlatforms.length > 0;
            })


            const filteredScheduledContents: (Partial<IBucket> & Partial<{ platforms: IPlatforms[] }>)[] = filteredContents.map((content) => {
                const validPlatforms = content.platforms.filter((platform) => {
                    return !["success","failed"].includes(platform.status) && platform.scheduledDate !== '' && new Date(platform.scheduledDate).getTime() >= now.getTime() && new Date(platform.scheduledDate).getTime() <= endTime.getTime();
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
                    const result: ISocialMediaUploadResponse[] = await providerService.handleSocialMediaUploads(content as IBucket, user, true)
                    if (result) {
                        for (let platform of result) {

                            const reviewBucket = db.model('reviewBucket', bucketSchema)
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
        logger.error('Error processing scheduled posts:', error);
    }
}


export function startScheduledPostsProcessor() {
    cron.schedule('*/2 * * * *', async () => {
        await processAgencyScheduledPosts();
    });
}





