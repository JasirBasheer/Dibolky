import { env } from "../config/env";
import { SocialMediaResponse } from "../types/common";

export async function getPages(
    accessToken: string
): Promise<SocialMediaResponse> {
    let allPages: any[] = [];
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



export async function getPagesV2(
    token: string
): Promise<SocialMediaResponse> {
  if (token === "") {
    throw new Error("Access token is required");
  }
  
  const response = await fetch(`https://graph.facebook.com/${env.META.API_VERSION}/me/accounts?access_token=${token}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Error fetching pages: ${JSON.stringify(data.error)}`);
  }

  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Invalid response format: expected data array");
  }

  return data;
}