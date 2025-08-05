import { IBucket } from "@/types";
import { getS3PublicUrl } from "../../utils/aws.utils";
import { VIDEO_EXTENSIONS } from "../../utils/video-dimensions.utils";
import { env } from "@/config";



export async function createInstaPostContainer(
    accountId: string, 
    access_token: string, 
    mediaUrl: string, 
    isVideo: boolean
): Promise<string> {
    try {
        const url = `https://graph.facebook.com/${env.META.API_VERSION}/${accountId}/media`;
        
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

        if (!data.id)throw new Error('No container ID returned from API');

        return data.id;
    } catch (error: unknown) {
        console.error('Error creating Instagram container:', error);
        throw error;
    }
}


export async function createInstaCarousel(
    businessId:string,
    access_token:string,
    containerIds:string[]
): Promise<string> {
    try { 
        const containerIdsString = containerIds.join(',')
        const url = `https://graph.facebook.com/${env.META.API_VERSION}/${businessId}/media`
        const params = new URLSearchParams({
            media_type:'CAROUSEL',
            children:containerIdsString,
            access_token,
            });
        

        const response = await fetch(`${url}?${params}`, { method: 'POST' });
        const data = await response.json();
        console.log("dataaaaaaaaaaaaaa",data)
        if(!data)throw new Error('No Instagram business account found');
        return data.id
        
    } catch (error: unknown) {
        throw error
    }
}


export async function uploadSinglePost(
    businessId:string,
    access_token:string,
    content:IBucket
): Promise<string> {
    try { 
        const url = `https://graph.facebook.com/${env.META.API_VERSION}/${businessId}/media`;
        let params;
        const contentUrl = await getS3PublicUrl(content.files[0].key)
        const contentExtension = content.files[0].fileName.split('.').pop()
        if(VIDEO_EXTENSIONS.includes("."+contentExtension as string)){
            console.log('entered to video ')
            params = new URLSearchParams({
                video_url: contentUrl, 
                media_type: 'REELS', 
                access_token: access_token,
                caption:content.caption,
            });   
        }else{
            console.log('entered to photo ')

            params = new URLSearchParams({
                image_url: contentUrl, 
                media_type: 'IMAGE', 
                access_token: access_token,
                caption:content.caption,
            });
        }

        const response = await fetch(`${url}?${params}`, { method: 'POST' });
        const data = await response.json();
        console.log(data)
        if(!data)throw new Error('No Instagram business account found');
        return data.id
        
    } catch (error: unknown) {
        throw error
    }
}
