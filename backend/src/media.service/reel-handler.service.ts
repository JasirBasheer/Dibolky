import { NotFoundError } from "mern.common";
import { getS3PublicUrl, getS3ViewUrl } from "../config/aws-s3.config";
import { checkReelUploadStatus, initializeReelUpload, publishReel, uploadHostedReel } from "../provider.strategies/facebook.strategy";
import { checkIGContainerStatus, fetchIGAccountId, publishInstagramContent, uploadIGReelContent } from "../provider.strategies/instagram.strategy";
import { IReviewBucket } from "../shared/types/common.types";
import { FACEBOOK, INSTAGRAM } from "../shared/utils/constants";
import { getPages } from "./shared.service";


// Instagram -- reel

export async function uploadIGReel(content: IReviewBucket, access_token: string): Promise<{name:string,status: string,id:string }> {
    try {

        const url = await getS3PublicUrl(content.files[0].key)
        const instagramAccountId = await fetchIGAccountId(content.metaAccountId, access_token);

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
        throw new Error(`Failed to upload reel`);
    }
}


// Facebook -- reel

export async function uploadFacebookReel(
    accessToken: string,
    content: IReviewBucket,
    caption: string
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
        const publishRespone = await publishReel(pageId, initResponse.video_id as string, pageAccessToken, caption)

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
