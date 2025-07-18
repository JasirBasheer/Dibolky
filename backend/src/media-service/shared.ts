import { META_API_VERSION } from "../config/env.config";
import { SocialMediaResponse } from "../types/common";

export async function getPages(
    accessToken: string
): Promise<SocialMediaResponse> {
    const url = `https://graph.facebook.com/${META_API_VERSION}/me/accounts?access_token=${accessToken}`;
    const response = await fetch(url)
    const data = await response.json();
    if (data.error) throw new Error('No Instagram business account found');
    return data
}