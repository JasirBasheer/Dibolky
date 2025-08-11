import axios from 'axios';
import { IBucket, IFiles } from "@/types";

export async function publishLinkedinVideo(
  filePath: string,
  accessToken: string,
  userURN: string,
  file: IFiles,
  content: IBucket
): Promise<{ name: string, status: string, id: string, error?: string, postId?: string }> {
  try {
    const fileResponse = await axios.get(filePath, { responseType: 'arraybuffer' });
    const fileBlob = fileResponse.data;

    const registerPayload = {
      registerUploadRequest: {
        owner: userURN,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent",
          },
        ],
      },
    };

    const { data: registerData } = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      registerPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202402",
        },
      }
    );

    const uploadUrl = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
    const videoUrn = registerData.value.asset;

    const contentType = file.key.endsWith(".mp4") ? "video/mp4" : "video/mpeg";

    await axios.put(uploadUrl, fileBlob, {
      headers: {
        "Content-Type": contentType,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    const postPayload = {
      author: userURN,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.caption || "Video post",
          },
          shareMediaCategory: "VIDEO",
          media: [
            {
              status: "READY",
              media: videoUrn,
              title: { text: "Video" },
              description: { text: "Video description for accessibility" },
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const postResponse = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202402",
        },
        validateStatus: () => true, 
      }
    );

    if (postResponse.status >= 400) {
      const errorData = postResponse.data;
      console.error(`Post error for video ${file.key}:`, JSON.stringify(errorData, null, 2));
      if (postResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to post: ${errorData.message}`);
    }
    console.log("linked video is on air .....")
    return { name: "linkedin", status: "success", id: content._id as string, };

  } catch (error: any) {
    console.error("LinkedIn Video Upload Error:", error.response?.data || error.message);
    throw error;
  }
}

