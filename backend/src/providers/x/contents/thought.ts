import { IBucket } from "@/types";
import { PLATFORMS } from "@/utils";
import axios from 'axios';

export async function publishXThought(
  content: IBucket,
  accessToken: string
): Promise<{ name: string, status: string, id: string }> {
  try {
     await axios.post(
      "https://api.x.com/2/tweets",
      {
        text: content.caption,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { name: PLATFORMS.X, status: "success", id: content._id as string };
  } catch (error:any) {
    console.error("Error posting to X:", error.response?.data || error.message);
    throw error;
  }
}
