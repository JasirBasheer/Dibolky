import axios from "axios";
import { env } from "@/config";
import { isErrorWithMessage } from "@/validators";

export type FBSendSuccess = {
  recipient_id: string;
  message_id: string;
  attachment_id?: string;
};

export type FBError = {
  message: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  fbtrace_id?: string;
};

export type FBSendErrorResponse = {
  error: FBError;
};

export type FBSendResponse = FBSendSuccess | FBSendErrorResponse;

type FBSendMessageType = "text" | "image" | "video";

interface FBSendPayload {
  recipient: { id: string };
  access_token: string;
  message:
    | { text: string }
    | {
        attachment: {
          type: Exclude<FBSendMessageType, "text">;
          payload: {
            url: string;
            is_reusable?: boolean;
          };
        };
      };
}

export async function sendFBMessage(
  conversation_id: string,
  access_token: string,
  message: string,
  type: "text" | "image" | "video" = "text",
  media_url?: string
): Promise<FBSendResponse> {
  const url = `https://graph.facebook.com/${env.META.API_VERSION}/${conversation_id}/messages`;
  try {
    const payload: Partial<FBSendPayload> = {
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
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error)
      ? error.message
      : "Unknown error";
    console.error("Error fetching IG messages:", errorMessage);
    throw new Error("Failed to send FB message");
  }
}
