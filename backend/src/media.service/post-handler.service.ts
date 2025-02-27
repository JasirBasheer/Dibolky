import { getS3ViewUrl } from "../config/aws-s3.config"
import { checkIGContainerStatus, createInstaCarousel, createInstaPostContainer, fetchIGAccountId, publishInstagramContent } from "../provider.strategies/instagram.strategy"
import { INSTAGRAM } from "../shared/utils/constants"
import { VIDEO_EXTENSIONS } from "../shared/utils/video-dimensions.utils"
import { getPages } from "./shared.service"




// Instagram - post

export async function uploadIGPost(content: any, access_token: string, user:any): Promise<any> {
    try {
        let containerIds = []
        // const pages = await getPages(access_token);
        // let pageId;

        // if (!Array.isArray(pages.data)) {
        //     console.error("Error: pages is not an array", pages);
        // } else if (!content.metaAccountId) {
        //     console.error("Error: Facebook username is missing", user?.content.metaAccountId);
        // } else {
        //     pageId = pages.data.find((item: any) => item.id === content.metaAccountId)?.id;
        // }
        
        const accountId = await fetchIGAccountId(content.metaAccountId, access_token)
        
        for (let file of content.files) {
            const isVideoExt = file.contentType == "video"
            
            console.log(isVideoExt);
            console.log("accountId",accountId.id)
            const url = await getS3ViewUrl(file.key)
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

        
        console.log("containerIds",containerIds)
        const containerId = await createInstaCarousel(accountId.id, access_token, containerIds)
        console.log("corousal cntainer id",containerId)
        console.log('entered to check the status of container')
        await checkIGContainerStatus(access_token,containerId)
        console.log('checkouted fomr status chekcing')
        const response = await publishInstagramContent(access_token, accountId.id, containerId)
        if (response) {
            return {
                name: INSTAGRAM,
                status: 'success',
                id: content._id
            }
        }

    } catch (error: any) {
        throw error
    }
}