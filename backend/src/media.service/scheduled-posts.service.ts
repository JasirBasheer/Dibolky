import cron from 'node-cron';
import { color } from 'console-log-colors';
import Agencies from '../models/agency/agencyModel';
import { connectTenantDB } from '../config/db';
import { ReviewBucketSchema } from '../models/agency/reviewBucketModel';
import ProviderService from '../services/Implementation/provider.service';
import { container } from 'tsyringe';
import { Types } from 'mongoose';

const providerService = container.resolve(ProviderService);

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


             const filteredScheduledContents :any = filteredContents.map((content) => {
                const validPlatforms = content.platforms.filter((platform) => {
                    return !platform.isPublished && platform.scheduledDate !== '' && new Date(platform.scheduledDate).getTime() >= now.getTime() && new Date(platform.scheduledDate).getTime() <= endTime.getTime(); 
                });

                return {
                    ...content.toObject(),
                    platforms: validPlatforms
                };
            });


            for (let content of filteredScheduledContents) {
                if (content.platforms.length > 0) {
                db = await connectTenantDB(agency.orgId)
                const result :any = await providerService.handleSocialMediaUploads(db,content,content.id,true)
                    console.log("result",result)
                if(result){
                    for(let platform of result){
                        
                        const reviewBucket = db.model('reviewBucket', ReviewBucketSchema)
                        let content = await reviewBucket.findOne({_id:new Types.ObjectId(platform.id)})
                        if(content){       
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





