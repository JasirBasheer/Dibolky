import { META_API_VERSION, META_CLIENTID, META_SECRETID } from "../config/env";
import { uploadIGPost } from "../media.service/post-handler.service";
import { uploadIGReel } from "../media.service/reel-handler.service";
import { CONTENT_TYPE } from "../shared/utils/constants";


export async function createInstagramOAuthURL(redirectUri: string): Promise<string> {
    const baseUrl = 'https://www.facebook.com/dialog/oauth';
    const params = new URLSearchParams({
        client_id: META_CLIENTID,
        display: 'page',
        extras: JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } }),
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: [
            'public_profile', 'pages_show_list', 'pages_read_engagement', 'pages_manage_posts',
            'pages_manage_metadata', 'pages_manage_engagement', 'pages_messaging', 'business_management',
            'instagram_basic', 'instagram_content_publish', 'instagram_manage_comments',
            'instagram_manage_insights', 'instagram_manage_messages','ads_management'
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}

export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<any> {
    const baseUrl = `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token`
    const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: META_CLIENTID,
        client_secret: META_SECRETID,
        fb_exchange_token: shortLivedToken
    });

    try {
        const response = await fetch(`${baseUrl}?${params.toString()}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to exchange token: ${JSON.stringify(error)}`);
        }

        const data = await response.json();
        return data.access_token
    } catch (error: any) {
        throw new Error(`Error exchanging token: ${error.message}`);
    }
}



export async function fetchIGAccountId(pageId: string, accessToken: string): Promise<any> {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.instagram_business_account) {
        return {
            isBusiness:true,
            id:data.instagram_business_account.id
        }
      }
      
       return {
        isBusiness:false,
        id:pageId
    }
    } catch (error) {
        console.error('Error finding Instagram Account ID:', error);
        throw error;
      }
}





export async function handleInstagramUpload(content: any, access_token: string, client:any): Promise<any> {
    try {

        switch (content.contentType) {
            case CONTENT_TYPE.POST:
                return await uploadIGPost(content, access_token, client)
            case CONTENT_TYPE.VIDEO:
                return null
            case CONTENT_TYPE.REEL:
                return await uploadIGReel(content, access_token, client)
            case CONTENT_TYPE.STORY:
                return null
        }
    } catch (error: any) {
        throw error;
    }

}



// Post 

export async function createInstaPostContainer(accountId: string, access_token: string, mediaUrl: string, isVideo: boolean): Promise<string> {
    try {
        const url = `https://graph.facebook.com/${META_API_VERSION}/${accountId}/media`;
        
        const params = new URLSearchParams({
            access_token,
            is_carousel_item: 'true',
            ...(isVideo ? {
                video_url: mediaUrl,
                media_type: 'VIDEO',
                sharing_type: 'FEED'
            } : {
                image_url: mediaUrl
            })
        });

        console.log(`Creating container for ${isVideo ? 'video' : 'image'} at ${accountId}`);

        const response = await fetch(`${url}?${params}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.error) {
            console.error('Container creation error:', data);
            throw new Error(`API Error: ${data.error.message}`);
        }

        if (!data.id) {
            throw new Error('No container ID returned from API');
        }

        return data.id;
    } catch (error: any) {
        console.error('Error creating Instagram container:', error);
        throw error;
    }
}






export async function createInstaCarousel(businessId:string,access_token:string,containerIds:string[]): Promise<any> {
    try { 
        const containerIdsString =containerIds.join(',')
        const url = `https://graph.facebook.com/${META_API_VERSION}/${businessId}/media`
        const params = new URLSearchParams({
            media_type:'CAROUSEL',
            children:containerIdsString,
            access_token,
            });
        

        const response = await fetch(`${url}?${params}`, { method: 'POST' });
        const data = await response.json();
        if(!data)throw new Error('No Instagram business account found');
        return data.id
        
    } catch (error: any) {
        throw error
    }
}





// Reel 
export async function uploadIGReelContent(accessToken: string, pageId: string, contentUrl: string, caption: string): Promise<any> {
    const url: string = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/media?media_type=REELS&video_url=${contentUrl}&caption=${caption}&share_to_feed=true&thumb_offset=10&access_token=${accessToken}`;
    const publishResponse = await fetch(url, { method: 'POST' });
    const data = await publishResponse.json();

    if (data) return data
    throw new Error('No Instagram business account found');
}


export async function checkIGContainerStatus(accessToken: string, containerId: string): Promise<any> {
    
    const url = `https://graph.facebook.com/${META_API_VERSION}/${containerId}?fields=status_code&access_token=${accessToken}`;

    while (true) {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data && data.status_code) {
            console.log(`Current Status: ${data.status_code}`);
            if (data.status_code === 'FINISHED') return data;
            if (data.status_code === 'ERROR') throw new Error('An error occurred while processing the container.');

        } else {
            console.log('Invalid response while fetching container status.');
        }

        await new Promise(resolve => setTimeout(resolve, 20_000));
    }
}


export async function publishInstagramContent(accessToken: string, businessId: string, creationId: string): Promise<any> {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${businessId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
    const publishResponse = await fetch(url, { method: 'POST' });
    const data = await publishResponse.json();
    console.log(data)

    if (data && !data.error) return data;
    // throw new Error('Media not ready after maximum attempts');
}


