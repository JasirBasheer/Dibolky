import { checkIGContainerStatus, createInstaCarousel, createInstaPostContainer, fetchIGAccountId, publishInstagramContent } from "../provider.strategies/instagram.strategy"
import { INSTAGRAM } from "../shared/utils/constants"
import { VIDEO_EXTENSIONS } from "../shared/utils/video-dimensions.utils"
import { getPages } from "./shared.service"




// Instagram - post

export async function uploadIGPost(content: any, access_token: string, client:any): Promise<any> {
    try {
        let containerIds = []
        const pages = await getPages(access_token);
        let pageId;

        if (!Array.isArray(pages.data)) {
            console.error("Error: pages is not an array", pages);
        } else if (!client?.socialMedia_credentials?.facebook?.userName) {
            console.error("Error: Facebook username is missing", client?.socialMedia_credentials?.facebook);
        } else {
            pageId = pages.data.find((item: any) => item.name === client.socialMedia_credentials.facebook.userName)?.id;
        }
        
        const accountId = await fetchIGAccountId(pageId, access_token)
        
        for (let url of content.url) {
            const extension = url.toLowerCase().split('.').pop();
            const isVideoExt = VIDEO_EXTENSIONS.includes(`.${extension}`);
            console.log(isVideoExt);
            console.log("accountId",accountId.id)
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