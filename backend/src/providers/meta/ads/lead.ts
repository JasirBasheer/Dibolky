import axios from "axios";

export async function getLeads(fromId: string, accessToken: string) {
  try {
    let allLeads = [];
    let nextPageUrl = `https://graph.facebook.com/v20.0/${fromId}/leads?access_token=${accessToken}`;

    while (nextPageUrl) {
      const response = await axios.get(nextPageUrl);
      const leads = (response.data?.data || []).map((lead: any) => ({
        ...lead,
        platform: "meta_ads",
      }));

      allLeads.push(...leads);
      nextPageUrl = response.data.paging?.next || null;
    }

    return allLeads;
  } catch (error: any) {
    console.error("Error fetching leads:", error.response?.data || error.message);
    throw new Error("Failed to fetch leads.");
  }
}
