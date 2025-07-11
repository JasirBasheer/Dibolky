import { META_API_VERSION, META_CLIENTID, META_SECRETID } from "@/config";
import { IMetaAccount } from "@/types";

export async function createFacebookOAuthURL(
    redirectUri: string
): Promise<string> {
    const baseUrl = 'https://www.facebook.com/dialog/oauth';
    const params = new URLSearchParams({
        client_id: META_CLIENTID,
        display: 'page',
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: [
            'public_profile', 'email', 'pages_show_list',
            'pages_manage_posts', 'pages_manage_metadata','instagram_content_publish',
            'pages_manage_engagement', 'pages_messaging', 'instagram_basic',
            'business_management', 'pages_read_user_content',
            'read_insights', 'ads_management',
            'ads_read', 'pages_read_engagement',
            'publish_video',
        ].join(',')
    });

    return `${baseUrl}?${params.toString()}`;
}


export async function getMetaPagesDetails(
    access_token: string
): Promise<IMetaAccount[]> {
    try {
        const pagesUrl = `https://graph.facebook.com/${META_API_VERSION}/me/accounts?access_token=${access_token}`;
        const response = await fetch(pagesUrl);
        const data = await response.json();
        const pages = data?.data || [];

        console.log("pages",pages,"data",data)

        return await Promise.all(
            pages.map(async (page: { id: string; name: string; }) => {
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

export async function getMetaAccessTokenStatus(
    access_token: string, 
): Promise<boolean> {
    try {
        const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${META_CLIENTID}|${META_SECRETID}`, {
            method: "GET"
        });
        
        if (!response.ok) return false;
        const details = await response.json();
        return details?.data?.is_valid ?? false;
    } catch (error) {
        return false;
    }
}
