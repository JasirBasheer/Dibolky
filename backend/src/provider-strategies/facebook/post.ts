import { META_API_VERSION } from "@/config";
import axios from "axios";

export async function uploadImageToFacebook(
    pageId: string,
    pageAccessToken: string,
    imageUrl: string,
): Promise<string> {
    try {
        const uploadUrl = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/photos`;
        const response = await axios.post(uploadUrl,{
            url:imageUrl,
            published:false,
            access_token:pageAccessToken
        },{
            headers:{
                "Content-Type": "application/json",
            }
        }
    )

    return response.data.id; 
    } catch (error) {
        console.error("Error in uploadImageToFacebook:", error);
        throw error;
    }
}


export async function createCarouselPost(
    pageId: string,
    pageAccessToken: string,
    mediaIds: string[],
    caption?: string
): Promise<string> {
    try {
        const postUrl = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/feed`;

        const attachedMedia = mediaIds.map(id => ({ media_fbid: id }));
        const payload: { message?: string; attached_media: Array<{ media_fbid: string }>; access_token: string } = {
            attached_media: attachedMedia,
            access_token: pageAccessToken,
            message : caption || ""
        };
     
        const response = await axios.post(postUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data.id; 
    } catch (error) {
        console.error("Error in createCarouselPost:", error);
        throw error;
    }
}