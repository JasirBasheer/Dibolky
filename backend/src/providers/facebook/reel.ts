import { META_API_VERSION } from "@/config";
import { IReelUploadStatus } from "@/types";
import { CustomError } from "mern.common";


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

// publish reel
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

