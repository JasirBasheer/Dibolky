import { IBucket } from "@/types";
import { getPages } from "./shared";
import { NotFoundError } from "mern.common";
import { META_API_VERSION } from "@/config";

export async function uploadFaceBookThought(
  accessToken: string,
  content: IBucket,
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  if (!content.metaAccountId) {
    return {
      name: "Facebook",
      status: "failed",
      id: content._id as string,
      error: "Facebook Page ID (metaAccountId) is required.",
    };
  }

  if (!content.caption || content.caption.trim() === "") {
    return {
      name: "Facebook",
      status: "failed",
      id: content._id as string,
      error: "Text message cannot be empty.",
    };
  }

  try {
    const pages = await getPages(accessToken);
    const page = pages.data.find((item: { id: string }) => item.id === content.metaAccountId);

    if (!page) {
      throw new NotFoundError(`Facebook Page with ID '${content.metaAccountId}' not found or your app does not have access.`);
    }

    const pageId = page.id;
    const pageAccessToken = page.access_token;

    console.log(`Attempting to post text to Facebook Page ID: ${pageId}`);

    const postResponse = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${pageId}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content.caption,
        access_token: pageAccessToken,
      }),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(`Failed to post text to Facebook: ${errorData.error.message}`);
    }

    const postData = await postResponse.json();
    console.log(`Facebook text post created with ID: ${postData.id}`);
    return {
      name: "Facebook",
      status: "success",
      id: content._id as string,
      postId: postData.id,
    };

  } catch (error: any) {
    console.error(`Error posting Facebook text: ${error.message}`);
    return {
      name: "Facebook",
      status: "failed",
      id: content._id as string,
      error: `Error posting Facebook text: ${error.message}`,
    };
  }
}