import { env } from "@/config";

export async function createMetaAdsOAuthURL(
    redirectUri: string
): Promise<string> {
    const baseUrl = 'https://www.facebook.com/dialog/oauth';
    const params = new URLSearchParams({
        client_id: env.META.CLIENT_ID,
        display: 'page',
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: [
            'pages_manage_posts', 'publish_video',
            'public_profile', 'email', 'pages_show_list',
            'pages_manage_metadata','instagram_content_publish',
            'pages_manage_engagement', 'pages_messaging', 'instagram_basic',
            'business_management', 'pages_read_user_content',
            'read_insights', 'ads_management','ads_read', 
            'pages_read_engagement','leads_retrieval', 'pages_manage_ads'
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}

export async function getAdAccounts(accessToken: string) {
  let adAccounts = [];
  let url = `https://graph.facebook.com/v20.0/me/adaccounts?fields=id,account_id,name&access_token=${accessToken}&limit=100`;

  while (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    adAccounts.push([...data.data])
    url = data.paging && data.paging.next ? data.paging.next : null;
  }

  return adAccounts;
}
