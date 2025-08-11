import axios from "axios";
import { getLeads } from "./lead";

export async function getAllAds(
  adId: string,
  accessToken: string,
  platform: string
) {
  try {
    const baseUrl = `https://graph.facebook.com/v20.0/${adId}/ads?fields=id,name,leadgen_form_id,status,adset_id,campaign_id,creative&access_token=${accessToken}`;
    let ads: any[] = [];
    let nextPageUrl: string | null = baseUrl;

    while (nextPageUrl) {
      const res = await axios.get(nextPageUrl);
      const data = res?.data?.data || [];

      const enrichedAds = await Promise.all(
        data.map(async (ad: any) => {
          const leadsPromise = ad.leadgen_form_id
            ? getLeads(ad.leadgen_form_id, accessToken)
            : Promise.resolve([]);
          const [creative, insights, leads] = await Promise.all([
            getCreative(ad.creative?.id, accessToken),
            getInsights(ad.id, accessToken),
            leadsPromise
          ]);

          return {
            ...ad,
            platform,
            creativeDetails: creative,
            insights,
            leads,
          };
        })
      );

      ads.push(...enrichedAds);

      nextPageUrl = res.data.paging?.next || null;
    }

    return ads;
  } catch (error) {
    console.log(error?.response?.data?.error, "errorrrrrrrr");
    throw error;
  }
}

async function getCreative(creativeId: string, token: string) {
  if (!creativeId) return null;
  try {
    const url = `https://graph.facebook.com/v20.0/${creativeId}?fields=object_story_spec,effective_object_story_id&access_token=${token}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Creative fetch error", error?.response?.data?.error);
    return null;
  }
}

async function getInsights(adId: string, token: string) {
  try {
    const url = `https://graph.facebook.com/v20.0/${adId}/insights?fields=impressions,clicks,spend,cpc,ctr,date_start,date_stop&access_token=${token}`;
    const res = await axios.get(url);
    return res.data?.data?.[0] || null;
  } catch (error) {
    console.error("Insights fetch error", error?.response?.data?.error);
    return null;
  }
}

export async function createMetaAd(adAccountId: string, params: {
  name: string;
  adset_id: string;
  creative: object;
  status: string;
}, accessToken: string): Promise<any> {
  const url = `https://graph.facebook.com/v20.0/act_${adAccountId}/ads`;
  const body = { ...params, access_token: accessToken };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}