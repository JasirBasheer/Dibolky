import { META_API_VERSION } from "@/config";
import { IBucket } from "@/types";
import axios from "axios";

export async function publishFaceBookVideo(
  pageId: string,
  pageAccessToken: string,
  videoUrl: string,
  content: IBucket
): Promise<{ name: string, status: string, id: string, error?: string, postId?: string }> {
  try {
    const postUrl = `https://graph.facebook.com/${META_API_VERSION}/${pageId}/videos`;

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
    return { name: "Facebook", status: "success", id: content._id as string, postId: postData.id};

  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error(`Error posting Facebook video: ${errorMessage}`);
    return { name: "Facebook", status: "failed", id: content._id as string, error: `Error posting Facebook video: ${errorMessage}`,};
  }
}