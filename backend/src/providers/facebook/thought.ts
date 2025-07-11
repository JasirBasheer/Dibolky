import { META_API_VERSION } from "@/config";
import { IBucket } from "@/types";
import axios from "axios";

export async function publishFaceBookThought(
  content: IBucket,
  pageId: string,
  pageAccessToken: string
): Promise<void> {
  try {
    await axios.post(
      `https://graph.facebook.com/${META_API_VERSION}/${pageId}/feed`,
      {
        message: content.caption || "",
        access_token: pageAccessToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error completing video upload:", error);
    throw error;
  }
}
