import { IBucket } from "../types/common";
import { getS3PublicUrl, getS3ViewUrl } from "../utils/aws.utils";
import { FACEBOOK, INSTAGRAM } from "../utils/constants";
import { 
    checkIGContainerStatus, 
    createInstaCarousel, 
    createInstaPostContainer, 
    fetchIGAccountId, 
    publishInstagramContent, 
    uploadSinglePost
} from "@/providers/instagram"
import { getPages } from "./shared";
import { NotFoundError } from "mern.common";
import { createCarouselPost, uploadImageToFacebook } from "@/providers/facebook";
import { getUserURN, publishLinkedInPost } from "@/providers/linkedin";



// INSTAGRAM POST
export async function uploadIGPost(
    content: IBucket, 
    access_token: string
): Promise<{ name: string, status: string, id: string }> {
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


// FACEBOOK POST

export async function uploadFacebookPost(
    accessToken: string,
    content: IBucket,
): Promise<{ name: string, status: string, id: string }> {
    try {
        if (!content.files.length)throw new Error("No images provided for the post.");

        const pages = await getPages(accessToken);
        const page = pages.data.find((item: { id: string }) => item.id === content.metaAccountId);

        if (!page) throw new NotFoundError("Meta page not found");

        const pageId = content.metaAccountId;
        const pageAccessToken = page.access_token;

        let postId;

            const mediaIds = [];
            for (const file of content.files) {
                const imageUrl = await getS3ViewUrl(file.key);
                const mediaId = await uploadImageToFacebook(pageId, pageAccessToken, imageUrl);
                mediaIds.push(mediaId);
            }
            postId = await createCarouselPost(pageId, pageAccessToken, mediaIds, content.caption);

        if (postId) {
            return {
                name: FACEBOOK,
                status: 'success',
                id: content._id as string 
            };
        } else {
            throw new Error("Failed to publish Facebook post");
        }

    } catch (error: unknown) {
        console.error("Error in uploadFacebookPost:", error);
        throw error;
    }
}


// LINKEDIN POST
export async function uploadLinkedinPost(
  accessToken: string,
  content: IBucket
): Promise<{name:string, status:string, id:string, error?:string}> {
    
    try {
    const userURN = await getUserURN(accessToken);
    const file = content.files[0];
    const filePath = await getS3PublicUrl(file.key);
    return await publishLinkedInPost(file,filePath,accessToken,userURN,content)
    
    } catch (error: any) {
     return { name: "linkedin", status: "failed", id: content._id as string,error:error.message}
    };

}