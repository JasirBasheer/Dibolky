import { env } from "../config/env";
import { SocialMediaResponse } from "../types/common";

export async function getPages(
    accessToken: string
): Promise<SocialMediaResponse> {
    let allPages = [];
    let nextUrl: string | undefined = `https://graph.facebook.com/${env.META.API_VERSION}/me/accounts?access_token=${accessToken}`;
    
    do {
        const response = await fetch(nextUrl);
        const data = await response.json();
        
        if (data.error) return { data: allPages };
        allPages = [...allPages, ...data.data];
        nextUrl = data.paging?.next;
    } while (nextUrl);
    
    return { data: allPages };
}

