import { IBucket } from "@/types";
import { PLATFORMS } from "@/utils";
import { isErrorWithMessage } from "@/validators";
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
  } catch (error:unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Error posting to X:", errorMessage);
    throw error;
  }
}
