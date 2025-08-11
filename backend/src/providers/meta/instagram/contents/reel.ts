import { env } from "@/config";

// Reel 
export async function uploadIGReelContent(
    accessToken: string, 
    pageId: string, 
    contentUrl: string, 
    caption: string
): Promise<{id:string ; error?:string}> {
    const params = new URLSearchParams({
        media_type: 'REELS',
        video_url: contentUrl,
        caption: caption,
        share_to_feed: 'true',
        access_token: accessToken
    });
    
    const url = `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}/media?${params.toString()}`;
    console.log("Request URL:", url);
    
    const publishResponse = await fetch(url, { method: 'POST' });
    const data = await publishResponse.json();
    
    if (data.error) {
        console.error("API Error:", JSON.stringify(data.error, null, 2));
        throw new Error(`Instagram API Error: ${data.error.message}`);
    }
    
    if (data.id) {
        return data;
    }
    
    throw new Error('Unexpected response: ' + JSON.stringify(data));
}

export async function checkIGContainerStatus(
    accessToken: string, 
    containerId: string
): Promise<{status_code: string; id: string}> {
    console.log("containerId", containerId);
    const url = `https://graph.facebook.com/${env.META.API_VERSION}/${containerId}?fields=status_code&access_token=${accessToken}`;

    while (true) {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Container status response:", JSON.stringify(data, null, 2));

        if (data.error) {
            throw new Error(`API error: ${JSON.stringify(data.error)}`);
        }

        if (data && data.status_code) {
            console.log(`Current Status: ${data.status_code}`);
            if (data.status_code === 'FINISHED') return data;
            if (data.status_code === 'ERROR') {
    throw new Error(`Container processing failed. Status: ERROR. Check video requirements.`);
}
        } else {
            throw new Error('Invalid response while fetching container status: ' + JSON.stringify(data));
        }

        await new Promise(resolve => setTimeout(resolve, 20_000));
    }
}


export async function publishInstagramContent(
    accessToken: string, 
    businessId: string, 
    creationId: string
): Promise<{id:string}> {
    const url = `https://graph.facebook.com/${env.META.API_VERSION}/${businessId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
    const publishResponse = await fetch(url, { method: 'POST' });
    const data = await publishResponse.json();
    if (data && !data.error) return data;
    throw new Error('Media not ready after maximum attempts');
}


