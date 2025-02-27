import { getS3ViewUrl } from "../config/aws-s3.config";
import { checkReelUploadStatus, initializeReelUpload, publishReel, uploadHostedReel } from "../provider.strategies/facebook.strategy";
import { checkIGContainerStatus, fetchIGAccountId, publishInstagramContent, uploadIGReelContent } from "../provider.strategies/instagram.strategy";
import { FACEBOOK, INSTAGRAM } from "../shared/utils/constants";
import { getPages } from "./shared.service";


// Instagram -- reel

export async function uploadIGReel(content: any, access_token: string, client: any): Promise<any> {
    try {

        // const pages = await getPages(access_token);
        // let pageId;

        // if (!Array.isArray(pages.data)) {
        //     console.error("Error: pages is not an array", pages);
        // } else if (!client?.socialMedia_credentials?.facebook?.userName) {
        //     console.error("Error: Facebook username is missing", client?.socialMedia_credentials?.facebook);
        // } else {
        //     pageId = pages.data.find((item: any) => item.name === client.socialMedia_credentials.facebook.userName)?.id;

        // }

        const url = await getS3ViewUrl(content.files[0].key)

        console.log("url",url)
        const instagramAccountId = await fetchIGAccountId(content.metaAccountId, access_token);
        console.log("instagramAccountId",instagramAccountId)

        const containerData = await uploadIGReelContent(access_token, instagramAccountId.id, url, content.caption)
        if (containerData.error) throw new Error(`Container creation failed: ${JSON.stringify(containerData.error)}`);

        await checkIGContainerStatus(access_token, containerData.id);
        const result = await publishInstagramContent(access_token, instagramAccountId.id, containerData.id);
        if (result) {
            return {
                name: INSTAGRAM,
                status: 'success',
                id: content._id
            }
        }

    } catch (error: any) {
        console.error('Reel upload error:', error);
        throw new Error(`Failed to upload reel: ${error.message}`);
    }
}


// Facebook -- reel

export async function uploadFacebookReel(
    accessToken: string,
    content: any,
    caption: string,
    client: any
): Promise<any> {
    try {

        const pages = await getPages(accessToken);
        let page;

        if (!Array.isArray(pages.data)) {
            console.error("Error: pages is not an array", pages);
        } else if (!client?.socialMedia_credentials?.facebook?.userName) {
            console.error("Error: Facebook username is missing", client?.socialMedia_credentials?.facebook);
        } else {
            page = pages.data.find((item: any) => item.name == client.socialMedia_credentials.facebook.userName)
        }

        const pageId = page.id
        const pageAccessToken = page.access_token;



        const initResponse = await initializeReelUpload(pageId, pageAccessToken)

        await uploadHostedReel(initResponse.video_id, content.url[0], pageAccessToken)
        console.log('entered status check ');
        await checkReelUploadStatus(initResponse.video_id, pageAccessToken)
        console.log('checkouted from status check ');
        const publishRespone = await publishReel(pageId, initResponse.video_id, pageAccessToken, caption)

        console.log('published from response', publishRespone)
        return {
            name: FACEBOOK,
            status: 'success',
            id: content._id
        };;
    } catch (error: any) {
        throw error;
    }

}
