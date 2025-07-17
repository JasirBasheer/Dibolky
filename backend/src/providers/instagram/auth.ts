import { META_API_VERSION, META_CLIENTID, META_SECRETID } from "@/config";

export async function createInstagramOAuthURL(
    redirectUri: string
): Promise<string> {
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
            'instagram_basic', 'instagram_content_publish', 'instagram_manage_comments','pages_show_list',
            'instagram_manage_insights', 'instagram_manage_messages','ads_management'
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}

export async function exchangeForLongLivedToken(
    shortLivedToken: string
): Promise<string> {
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
    } catch (error: unknown) {
        throw new Error(`Error exchanging token: ${error instanceof Error ? error.message : String(error)}`);
    }
}



export async function fetchIGAccountId(
    pageId: string, 
    accessToken: string
): Promise<{isBusiness:boolean;id:string}> {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.instagram_business_account) return { isBusiness:true, id:data.instagram_business_account.id }
      
       return { isBusiness:false, id:pageId }
    } catch (error) {
        console.error('Error finding Instagram Account ID:', error);
        throw error;
      }
}
