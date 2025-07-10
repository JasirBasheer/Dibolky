import { CustomError } from "mern.common";
import { META_API_VERSION, META_CLIENTID, META_SECRETID } from "../config/env.config";
import { uploadFacebookReel } from "../media.service/reel-handler";
import { IMetaAccount, IBucket, IReelUploadStatus } from "../types/common";
import { CONTENT_TYPE } from "../utils/constants.utils";
import { uploadFaceBookStory } from "@/media.service/story-handler";
import { uploadFaceBookThought } from "@/media.service/thought-handler";
import { uploadFaceBookVideo } from "@/media.service/video-handler";


export async function createFacebookOAuthURL(
    redirectUri: string
): Promise<string> {
    const baseUrl = 'https://www.facebook.com/dialog/oauth';
    const params = new URLSearchParams({
        client_id: META_CLIENTID,
        display: 'page',
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: [
            'public_profile', 'email', 'pages_show_list',
            'pages_manage_posts', 'pages_manage_metadata','instagram_content_publish',
            'pages_manage_engagement', 'pages_messaging', 'instagram_basic',
            'business_management', 'pages_read_user_content',
            'read_insights', 'ads_management',
            'ads_read', 'pages_read_engagement',
            'publish_video',
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}


export async function getMetaPagesDetails(
    access_token: string
): Promise<IMetaAccount[]> {
    try {
        const pagesUrl = `https://graph.facebook.com/${META_API_VERSION}/me/accounts?access_token=${access_token}`;
        const response = await fetch(pagesUrl);
        const data = await response.json();
        const pages = data?.data || [];

        console.log("pages",pages,"data",data)

        return await Promise.all(
            pages.map(async (page: { id: string; name: string; }) => {
                const pageDetailsUrl = `https://graph.facebook.com/${META_API_VERSION}/${page.id}?fields=picture&access_token=${access_token}`;
                const pageDetailsResponse = await fetch(pageDetailsUrl);
                const pageDetailsData = await pageDetailsResponse.json();
                
                return {
                    pageId:page.id,
                    pageName: page.name,
                    pageImage: pageDetailsData?.picture?.data?.url || '',
                };
            })
        );

    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
}


export async function handleFacebookUpload(
    content: IBucket, 
    access_token: string
): Promise<{name:string,status: string,id:string } > {
    switch (content.contentType) {
        case CONTENT_TYPE.REEL:
            return await uploadFacebookReel(access_token, content)
        case CONTENT_TYPE.VIDEO:
            return await uploadFaceBookVideo(access_token, content)
        case CONTENT_TYPE.STORY:
            return await uploadFaceBookStory(access_token, content)
        case CONTENT_TYPE.THOUGHT:
            return await uploadFaceBookThought(access_token, content)
        default:
            throw new Error(`Unsupported content type`);
    }
}



// Reel init
export async function initializeReelUpload(
    pageId: string, 
    pageAccessToken: string
): Promise<{video_id?:string;video_url:string;upload_url:string}> {
    try {
        const inititUrl = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/video_reels`;

        const response = await fetch(inititUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                upload_phase: "start",
                access_token: pageAccessToken
            })
        });

        const initResponse = await response.json();
        if (!response.ok) throw new CustomError(`Error: ${initResponse.error.message}`,500);

        console.log(initResponse,"initResponse")
        return initResponse
    } catch (error) {
        throw error
    }

}


export async function uploadHostedReel(
    videoId: string, 
    url: string, 
    pageAccessToken: string
): Promise<{success:boolean;message:string,video_id:string}> {
    try {

        const uploadUrl = `https://rupload.facebook.com/video-upload/v22.0/${videoId}`;
        let hostedFileUrl = url

        const s3Response = await fetch(hostedFileUrl);
        if (!s3Response.ok) throw new Error(`S3 file not accessible: ${s3Response.status}`);
        
        const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                "Authorization": `OAuth ${pageAccessToken}`,
                "file_url": hostedFileUrl
            }
        });

        const data = await response.json();
        console.log(data,'data fron facebook')

        if (!response.ok) throw new Error(`Error: ${data.error.message}`);
        console.log("UploadHostedReel",data)
        return data


    } catch (error) {
        console.error("Error uploading hosted file:", error);
        throw error

    }
}

export async function checkReelUploadStatus(
    videoId: string, 
    pageAccessToken: string
): Promise<IReelUploadStatus> {
    
    const statusCheckUrl = `https://graph.facebook.com/v22.0/${videoId}?fields=status&access_token=${pageAccessToken}`;
    const interval = 30_000; 
    const maxAttempts = 15;
    
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const checkStatus = async () => {
            try {
                
                const response = await fetch(statusCheckUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    clearInterval(intervalId);
                    reject(new Error(`API Error: ${data.error?.message || 'Unknown error'}`));
                    return;
                }
                
                console.log("Video Status:", data);
                
                if (data.status?.video_status == "upload_complete") {
                    clearInterval(intervalId);
                    resolve(data);
                    return;
                }
                
                if (data.status?.state === "error") {
                    clearInterval(intervalId);
                    reject(new Error(`Upload failed: ${data.status?.description || 'Unknown error'}`));
                    return;
                }
                
                attempts += 1;
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    reject(new Error(`Timeout: Status check exceeded ${maxAttempts} attempts`));
                }
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        };
        
        checkStatus();
        
        const intervalId = setInterval(checkStatus, interval);
    });
}





export async function publishReel(
    pageId:string,
    videoId:string,
    pageAccessToken:string,
    captions:string
):Promise<{success:boolean;message:string;post_id:string}> {
    try {
        const finishUploadUrl = `https://graph.facebook.com/v22.0/${pageId}/video_reels?access_token=${pageAccessToken}&video_id=${videoId}&upload_phase=finish&video_state=PUBLISHED&description=${encodeURIComponent(captions)}`;
        const response = await fetch(finishUploadUrl, {
            method: "POST"
        });

        const data = await response.json();
        if (!response.ok) throw new Error(`Error: ${data.error.message}`);
        console.log("Video published successfully:", data);
        return data
    } catch (error) {
        console.error("Error completing video upload:", error);
        throw error
    }
}




export async function getMetaAccessTokenStatus(
    access_token: string, 
): Promise<boolean> {
    try {
        const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${META_CLIENTID}|${META_SECRETID}`, {
            method: "GET"
        });
        
        if (!response.ok) return false;
        
        const details = await response.json();
        return details?.data?.is_valid ?? false;
    } catch (error) {
        return false;
    }
}