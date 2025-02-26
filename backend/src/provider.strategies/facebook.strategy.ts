import { META_API_VERSION, META_CLIENTID } from "../config/env";
import { uploadFacebookReel } from "../media.service/reel-handler.service";
import { CONTENT_TYPE } from "../shared/utils/constants";


export async function createFacebookOAuthURL(redirectUri: string): Promise<string> {
    const baseUrl = 'https://www.facebook.com/dialog/oauth';
    const params = new URLSearchParams({
        client_id: META_CLIENTID,
        display: 'page',
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: [
            'public_profile', 'email', 'pages_show_list',
            'pages_manage_posts', 'pages_manage_metadata',
            'pages_manage_engagement', 'pages_messaging',
            'business_management', 'pages_read_user_content',
            'read_insights', 'ads_management',
            'ads_read', 'pages_read_engagement',
            'publish_video',
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}


export async function getMetaPagesDetails(access_token: string): Promise<any[]> {
    try {
        const pagesUrl = `https://graph.facebook.com/${META_API_VERSION}/me/accounts?access_token=${access_token}`;
        const response = await fetch(pagesUrl);
        const data = await response.json();
        const pages = data?.data || [];

        console.log("pages",pages,"data",data)

        return await Promise.all(
            pages.map(async (page: any) => {
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


export async function handleFacebookUpload(content: any, access_token: string, client:any): Promise<any> {
    switch (content.contentType) {
        case CONTENT_TYPE.REEL:
            return await uploadFacebookReel(access_token, content, content.caption, client)
        case CONTENT_TYPE.VIDEO:
    }
}



// Reel init
export async function initializeReelUpload(pageId: string, pageAccessToken: string): Promise<any> {
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

        if (!response.ok) throw new Error(`Error: ${initResponse.error.message}`);

        return initResponse
    } catch (error) {
        console.error("Error during upload start:", error);
    }

}


export async function uploadHostedReel(videoId: any, url: string, pageAccessToken: string): Promise<any> {
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
        return data

    } catch (error) {
        console.error("Error uploading hosted file:", error);

    }
}

export async function checkReelUploadStatus(videoId: string, pageAccessToken: string): Promise<any> {
    
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





export async function publishReel(pageId:string,videoId:string,pageAccessToken:string,captions:string):Promise<any> {
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
    }
}
