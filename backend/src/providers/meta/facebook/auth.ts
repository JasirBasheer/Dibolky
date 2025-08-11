import { env } from "@/config";
import { IMetaAccount } from "@/types";
import axios from "axios";

export async function createFacebookOAuthURL(
    redirectUri: string
): Promise<string> {
    const baseUrl = 'https://www.facebook.com/dialog/oauth';
    const params = new URLSearchParams({
        client_id: env.META.CLIENT_ID,
        display: 'page',
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: [
            'public_profile', 'email', 'pages_show_list',
            'pages_manage_posts', 'pages_manage_metadata','instagram_content_publish',
            'pages_manage_engagement', 'pages_messaging', 'instagram_basic',
            'business_management', 'pages_read_user_content',
            'read_insights', 'ads_management','ads_read', 
            'pages_read_engagement', 'publish_video',
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}


export async function getMetaPagesDetails(
    access_token: string
): Promise<IMetaAccount[]> {
    try {
        const pagesUrl = `https://graph.facebook.com/${env.META.API_VERSION}/me/accounts?access_token=${access_token}`;
        const response = await fetch(pagesUrl);
        const data = await response.json();
        const pages = data?.data || [];

        console.log("pages",pages,"data",data)

        return await Promise.all(
            pages.map(async (page: { id: string; name: string; }) => {
                const pageDetailsUrl = `https://graph.facebook.com/${env.META.API_VERSION}/${page.id}?fields=picture&access_token=${access_token}`;
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

export async function getMetaAccessTokenStatus(
    tokens: {accessToken?:string,refreshToken?:string}, 
): Promise<boolean> {
    try {
        const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${tokens.accessToken}&access_token=${env.META.CLIENT_ID}|${env.META.SECRET_ID}`, {
            method: "GET"
        });
        
        if (!response.ok) return false;
        const details = await response.json();
        return details?.data?.is_valid ?? false;
    } catch (error) {
        return false;
    }

}



export async function getIGTokenDetails(pageId: string, accessToken: string) {
  try {
    const igAccountResponse = await axios.get(
      `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}`,
      {
        params: {
          fields: "instagram_business_account",
          access_token: accessToken,
        },
      }
    );
    const igAccountId = igAccountResponse.data.instagram_business_account?.id;
    if (!igAccountId) {
      throw new Error("No Instagram Business account linked to this Page");
    }

    const response = await axios.get(
      `https://graph.facebook.com/${env.META.API_VERSION}/${igAccountId}`,
      {
        params: {
          fields: "id,username,name,profile_picture_url",
          access_token: accessToken,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching IG user details:", error.response?.data || error.message);
    return null;
  }
}