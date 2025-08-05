import axios from "axios";
import { env } from "@/config";
import { isErrorWithMessage } from "@/validators";

export async function getFBConversations(
  pageId: string,
  access_token: string
): Promise<any> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}/conversations`;
  try {
    const response = await axios.get(url, {
      params: {
        access_token,
        fields: "id,participants,updated_time",
      },
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching FB conversations:", errorMessage);
    throw new Error("Failed to fetch FB conversations");
  }
}


export async function getFBMessages(
  conversation_id: string,
  access_token: string
): Promise<any> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${conversation_id}/messages`;
  try {
    const response = await axios.get(url, {
      params: {
        fields: "from,to,message,created_time,id,attachments", 
        access_token,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error fetching FB messages:", errorMessage);
    throw new Error("Failed to fetch FB messages");
  }
}

export async function getFBMessageSenderDetails(
  userId: string,
  access_token: string
): Promise<any> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${userId}`;
  try {
    const response = await axios.get(url, {
      params: {
        fields: "name,first_name,last_name,profile_picture",
        access_token,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching FB user details:", error?.response?.data || error.message);
    throw new Error("Failed to fetch FB user details");
  }
}