import { env } from "@/config";

export const getFBMedia = async (mediaId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${env.META.API_VERSION}/${mediaId}?fields=id,message,created_time,permalink_url,attachments{subattachments,media_type,url,media{image,source}},story&access_token=${accessToken}`
  );
  const data = await res.json();
  console.log(data)
  if(data.error) console.log(`Error fetching comments from getfbmedias : ${JSON.stringify(data.error)}`);
  return data ;
};


export const getFBInsights = async (mediaId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${mediaId}/insights?metric=post_impressions_organic&access_token=${accessToken}`
  );
  const data = await res.json();
  if (data.error)console.log(`Error fetching replies: ${JSON.stringify(data.error)}`);
  return data.data || [];
};
