import cron from 'node-cron';
import mongoose from 'mongoose';


async function processScheduledPosts() {
    try {
        const now = new Date();
        const endTime = new Date(now.getTime() + 2 * 60 * 1000); 

        const scheduledPosts = await mongoose.model('Post').find({
            isScheduled: true,
            status: 'pending',
            scheduledDate: {
                $gte: now,
                $lt: endTime
            }
        });

        for (const post of scheduledPosts) {
            try {
                // Get the organization's access token from your token storage
                const orgAccessToken = await getOrgAccessToken(post.orgId); // You'll need to implement this

                if (post.platform.includes('instagram')) {
                    await publishToInstagram(post, orgAccessToken);
                }

                // Update post status to published
                await mongoose.model('Post').updateOne(
                    { _id: post._id },
                    { 
                        $set: { 
                            status: 'published',
                            publishedDate: new Date()
                        }
                    }
                );
            } catch (error) {
                // Update post status to failed
                await mongoose.model('Post').updateOne(
                    { _id: post._id },
                    { 
                        $set: { 
                            status: 'failed',
                            errorMessage: error.message
                        }
                    }
                );
                console.error(`Failed to publish post ${post._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error processing scheduled posts:', error);
    }
}

// Start the cron job to run every minute
export function startScheduledPostsProcessor() {
    cron.schedule('* * * * *', async () => {
        await processScheduledPosts();
    });
}