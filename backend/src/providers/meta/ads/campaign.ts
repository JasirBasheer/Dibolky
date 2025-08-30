
export async function createMetaCampaign(
  accessToken: string,
  adAccountId: string,
  name: string,
  objective: string
){
  const url = `https://graph.facebook.com/v20.0/act_${adAccountId}/campaigns?access_token=${accessToken}`;
  const payload = {
    name: name,
    objective: objective,
    status: "PAUSED",
    special_ad_categories: [],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error creating campaign: ${JSON.stringify(error)}`);
  }
  return response.json();
}

export async function getMetaCampaigns(accessToken: string, adAccountId: string) {
  let url = `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?fields=name,status,objective,daily_budget,start_time,stop_time,effective_status,account_id,created_time,updated_time&access_token=${accessToken}&limit=100`;
  let adAccountCampaigns = [];
  while (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    adAccountCampaigns = adAccountCampaigns.concat(data.data);
    url = data.paging && data.paging.next ? data.paging.next : null;
  }

  return adAccountCampaigns;
}

export async function setMetaCampaignStatus(
  accessToken: string,
  campaignId: string,
  status: "PAUSED" | "ACTIVE"
) {
  const url = `https://graph.facebook.com/v20.0/${campaignId}?access_token=${accessToken}`;
  const payload = { status };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok)
    throw new Error(`Error updating status: ${response.status}`);
  return response.json();
}

export async function fetchMetaAdsInCampaign(
  accessToken: string,
  campaignId: string
){
  let ads= [];
  let url = `https://graph.facebook.com/v20.0/${campaignId}/ads?fields=id,name,status&access_token=${accessToken}&limit=100`;
  while (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching ads: ${response.status}`);
    const data = await response.json();
    ads = ads.concat(data.data);
    url = data.paging?.next || null;
  }
  return ads;
}

export async function fetchMetaCampaignInsights(
  accessToken: string,
  campaignId: string,
  params: string = "impressions,clicks,spend"
) {
  const url = `https://graph.facebook.com/v20.0/${campaignId}/insights?fields=${params}&access_token=${accessToken}`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Error fetching insights: ${response.status}`);
  return response.json();
}
