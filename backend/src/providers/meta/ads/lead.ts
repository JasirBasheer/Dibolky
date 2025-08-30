import { isErrorWithMessage } from "@/validators";
import axios from "axios";

export async function getLeads(fromId: string, accessToken: string) {
  try {
    let allLeads = [];
    let nextPageUrl = `https://graph.facebook.com/v20.0/${fromId}/leads?access_token=${accessToken}`;

    while (nextPageUrl) {
      const response = await axios.get(nextPageUrl);
      const leads = (response.data?.data || []).map((lead) => ({
        ...lead,
        platform: "meta_ads",
      }));

      allLeads.push(...leads);
      nextPageUrl = response.data.paging?.next || null;
    }

    return allLeads;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching leads:", errorMessage);
    throw new Error("Failed to fetch leads.");
  }
}
