import axios from "axios";

export async function getAllAdSetsByCampaignId(campaignId: string, accessToken: string) {
  let adSets = [];
  let nextPageUrl: string | null = `https://graph.facebook.com/v20.0/${campaignId}/adsets?fields=id,name,daily_budget,lifetime_budget,start_time,end_time,status,targeting,bid_amount,optimization_goal&access_token=${accessToken}`;

  while (nextPageUrl) {
    try {
      const res = await axios.get(nextPageUrl);
      const data = res.data?.data ?? []
      adSets.push(...data);

      nextPageUrl = res.data.paging?.next || null;
    } catch (error) {
      console.error("Error fetching ad sets:", error);
      break; 
    }
  }

  return adSets;
}


export async function getAnalyticsByAdSetId(adSetId: string, accessToken: string) {
  const baseUrl = `https://graph.facebook.com/v20.0/${adSetId}/insights?fields=impressions,clicks,conversions,spend&access_token=${accessToken}`;
  try {
    const res = await axios.get(baseUrl);
    const data = res.data?.data?.[0] || {};
    return {
      impressions: parseInt(data.impressions || "0"),
      clicks: parseInt(data.clicks || "0"),
      conversions: parseInt(data.conversions || "0"),
      spend: parseFloat(data.spend || "0") * 100, 
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}



export async function createAdSet(adAccountId: string, params: {
  name: string;
  campaign_id: string;
  daily_budget: number;
  billing_event: string;
  optimization_goal: string;
  targeting: object;
  status: string;
}, accessToken: string): Promise<any> {
  const url = `https://graph.facebook.com/v20.0/act_${adAccountId}/adsets`;
  const body = { ...params, access_token: accessToken };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}


