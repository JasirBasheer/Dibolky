import { checkReelProcess, checkReelUploadStatus, initializeReelUpload, publishReel, uploadHostedReel } from "../provider.strategies/facebook.strategy";
import { checkIGContainerStatus, fetchIGBusinessAccountId, publishInstagramReel, uploadIGReelContent } from "../provider.strategies/instagram.strategy";
import { getPages } from "./shared.service";




// Instagram




export async function uploadIGReel(content: any, access_token: string): Promise<any> {
    try {
        const pages = await getPages(access_token)
        const pageId = pages?.data[0].id
        console.log(pages,pageId)
        const businessId = await fetchIGBusinessAccountId(pageId, access_token)
        const creationId = await uploadIGReelContent(access_token, businessId, content.url, content.caption)
        console.log(businessId,creationId);
        
        const status = await checkIGContainerStatus(access_token, creationId.id)
        if (!status) throw new Error('Error uploading content to instagram')
        return await publishInstagramReel(access_token, businessId, creationId.id)
    } catch (error:any) {
        throw error;
    }

}



// Facebook

export async function uploadFacebookReel(
    accessToken: string,
    content: any,
    caption: string
): Promise<any> {
    try {
        console.log('facebook enter');
        
        const pages = await getPages(accessToken);

        if (!pages?.data?.[1]?.id || !pages?.data?.[1]?.access_token) throw new Error('Failed to get page details');
        
        const pageId = pages.data[1].id;
        const pageAccessToken = pages.data[1].access_token;

        
        
        const initResponse = await initializeReelUpload(pageId, pageAccessToken)
       
        await uploadHostedReel(initResponse.video_id, content.url, pageAccessToken)
        console.log('entered status check ');        
        await checkReelUploadStatus(initResponse.video_id, pageAccessToken)
        console.log('checkouted from status check ');        
        const publishRespone = await publishReel(pageId, initResponse.video_id, pageAccessToken, caption)
        // await checkReelProcess(initResponse.video_id, pageAccessToken)


        console.log('published from response', publishRespone)
        return publishRespone;
    } catch (error: any) {
        throw error;
    }

}
