import { META_API_VERSION } from "../config/env";
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



export async function getPagesV2(
    token: string
): Promise<SocialMediaResponse> {
  if (token === "") {
    throw new Error("Access token is required");
  }
  
  // Fixed: Use /me/accounts endpoint to get pages, not just /me
  const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/me/accounts?access_token=${token}`);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Error fetching pages: ${JSON.stringify(data.error)}`);
  }

  // Add validation to ensure data structure is as expected
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error("Invalid response format: expected data array");
  }

  return data;
}