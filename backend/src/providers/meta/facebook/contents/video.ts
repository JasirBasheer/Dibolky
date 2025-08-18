import { env } from "@/config";
import { IBucket } from "@/types";
import { PLATFORMS } from "@/utils";
import { isErrorWithMessage } from "@/validators";
import axios from "axios";

export async function publishFaceBookVideo(
  pageId: string,
  pageAccessToken: string,
  videoUrl: string,
  content: IBucket
): Promise<{ name: string, status: string, id: string, error?: string, postId?: string }> {
  try {
    const postUrl = `https://graph.facebook.com/${env.META.API_VERSION}/${pageId}/videos`;

    const { data: postData } = await axios.post(postUrl, {
      file_url: videoUrl,
      description: content.caption || "Default video description",
      title: (content.caption || "Video").substring(0, 100),
      access_token: pageAccessToken,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Facebook video posted with ID: ${postData.id}`);
    return { name: PLATFORMS.FACEBOOK, status: "success", id: content._id as string, postId: postData.id};

  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    return { name: PLATFORMS.FACEBOOK, status: "failed", id: content._id as string, error: `Error posting Facebook video: ${errorMessage}`,};
  }
}