import axios from "axios";
import { env } from "@/config";
import { isErrorWithMessage } from "@/validators";

export async function getIGConversations(
  pageId: string,
  access_token: string
): Promise<any> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}/conversations`;

 try {
    const response = await axios.get(url, {
      params: {
        platform: "instagram",
        access_token,
      },
    });

    return response.data.data || [];
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching IG conversations:", errorMessage);
    return []
  }
}


export async function getIGMessages(
  conversation_id: string,
  access_token: string
): Promise<any> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${conversation_id}/messages`;

  try {
    const response = await axios.get(url, {
      params: {
        fields: "from,to,message,created_time,id",
        access_token,
      },
    });

    return response.data.data || [];
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching IG messages:", errorMessage);
    throw new Error("Failed to fetch IG messages");
  }
}



export async function getIGMessageSenderDetails(
  iGSid: string,
  access_token: string
): Promise<any> {
  const url = `https://graph.facebook.com/v20.0/${iGSid}`;

  try {
    const response = await axios.get(url, {
      params: {
        fields: "name,username,profile_pic",
        access_token,
      },
    });

    return response.data;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching IG messages:", errorMessage);
    throw new Error("Failed to fetch IG messages");
  }
}
