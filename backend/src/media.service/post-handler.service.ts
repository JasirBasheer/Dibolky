import { getS3PublicUrl } from "../config/aws-s3.config"
import { checkIGContainerStatus, createInstaCarousel, createInstaPostContainer, fetchIGAccountId, publishInstagramContent, uploadSinglePost } from "../provider.strategies/instagram.strategy"
import { IReviewBucket } from "../shared/types/common.types";
import { INSTAGRAM } from "../shared/utils/constants"



// Instagram - post

export async function uploadIGPost(content: IReviewBucket, access_token: string): Promise<{ name: string, status: string, id: string }> {
    try {
        const accountId = await fetchIGAccountId(content.metaAccountId, access_token);
        let containerId;

        if (content.files.length < 2) {
            const response = await uploadSinglePost(accountId.id, access_token, content)
            if (response) containerId = response
        } else {
            let containerIds = []

            for (let file of content.files) {
                const isVideoExt = file.contentType == "video"

                console.log("accountId", accountId.id)
                const url = await getS3PublicUrl(file.key)
                const containerId = await createInstaPostContainer(accountId.id, access_token, url, isVideoExt)
                console.log(containerId);

                const status = await checkIGContainerStatus(access_token, containerId);
                if (status.status_code === 'FINISHED') {
                    containerIds.push(containerId);
                    console.log(`Container ${containerId} is ready`);
                } else {
                    throw new Error(`Container ${containerId} failed to process: ${status.status_code}`);
                }
            }


            containerId = await createInstaCarousel(accountId.id, access_token, containerIds)
        }

        await checkIGContainerStatus(access_token, containerId as string)
        const response = await publishInstagramContent(access_token, accountId.id, containerId as string)
        if (response) {
            return {
                name: INSTAGRAM,
                status: 'success',
                id: content._id as string
            }
        } else {
            throw new Error("Failed to publish Instagram content");
        }

    } catch (error: unknown) {
        throw error
    }
}