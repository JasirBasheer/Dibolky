import { NotFoundError } from "mern.common";
import { getPages } from "./shared";
import { getS3PublicUrl, getS3ViewUrl } from "../utils/aws.utils";
import { IBucket } from "../types/common";
import { FACEBOOK, INSTAGRAM } from "../utils/constants.utils";
import { 
    checkReelUploadStatus, 
    initializeReelUpload, 
    publishReel, 
    uploadHostedReel 
} from "../provider-strategies/facebook";
import { 
    checkIGContainerStatus, 
    fetchIGAccountId, 
    publishInstagramContent, 
    uploadIGReelContent 
} from "../provider-strategies/instagram";


// Instagram -- reel

export async function uploadIGReel(
    content: IBucket, 
    access_token: string
): Promise<{name:string,status: string,id:string }> {
    try {

        const url = await getS3PublicUrl(content.files[0].key)
        console.log(url,'urllllllll')
        const instagramAccountId = await fetchIGAccountId(content.metaAccountId, access_token);
        console.log(access_token, instagramAccountId.id, url, content.caption)
        const containerData = await uploadIGReelContent(access_token, instagramAccountId.id, url, content.caption)
        if (containerData.error) throw new Error(`Container creation failed: ${JSON.stringify(containerData.error)}`);

        await checkIGContainerStatus(access_token, containerData.id);
        const result = await publishInstagramContent(access_token, instagramAccountId.id, containerData.id);
        if (result) {
            return {
                name: INSTAGRAM,
                status: 'success',
                id: content._id as string
            }
        }else{
            throw new Error("Failed to publish Instagram Reel");
        }
    } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to upload reel: ${errorMessage}`);    }
}


// Facebook -- reel

export async function uploadFacebookReel(
    accessToken: string,
    content: IBucket,
): Promise<{name:string,status: string,id:string }> {
    try {

        const pages = await getPages(accessToken);
        const page= pages.data.find((item: { id: string }) => item.id == content.metaAccountId)
        if(!page)throw new NotFoundError("Meta page not found")
        const pageId = content.metaAccountId
        const pageAccessToken = page.access_token;

        const initResponse = await initializeReelUpload(pageId, pageAccessToken)
        const url = await getS3ViewUrl(content.files[0].key)

        await uploadHostedReel(initResponse.video_id as string, url, pageAccessToken)
        await checkReelUploadStatus(initResponse.video_id as string, pageAccessToken)
        const publishRespone = await publishReel(pageId, initResponse.video_id as string, pageAccessToken, content.caption)

        if (publishRespone) {
            return {
                name: FACEBOOK,
                status: 'success',
                id: content._id as string
            };
        }else{
            throw new Error("Failed to publish Instagram Reel");
        }
   
    } catch (error: unknown) {
        throw error;
    }

}
