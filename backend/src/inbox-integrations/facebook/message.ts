import axios from "axios";
import { META_API_VERSION } from "@/config";

export async function sendFBMessage(
  conversation_id: string,
  access_token: string,
  message: string,
  type: "text" | "image" | "video" = "text",
  media_url?: string
): Promise<any> {
  const url = `https://graph.facebook.com/${META_API_VERSION}/${conversation_id}/messages`;
  try {
    const payload: any = {
      recipient: { id: conversation_id },
      access_token,
    };
    if (type === "text") {
      payload.message = { text: message };
    } else if (type === "image" || type === "video") {
      if (!media_url) throw new Error("Media URL is required");
      payload.message = {
        attachment: {
          type,
          payload: { url: media_url },
        },
      };
    } else {
      throw new Error("Invalid message type");
    }
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error sending FB message:", error?.response?.data || error.message);
    throw new Error("Failed to send FB message");
}
  }