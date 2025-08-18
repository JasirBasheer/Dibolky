import axios from 'axios';
import { IBucket, IFiles } from "@/types";
import { PLATFORMS } from '@/utils';
import { isErrorWithMessage } from '@/validators';

export async function publishLinkedInPost(
  file: IFiles,
  filePath: string,
  accessToken: string,
  userURN: string,
  content: IBucket
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  try {
    const fileResponse = await axios.get(filePath, { responseType: 'arraybuffer' });
    const fileBlob = fileResponse.data;

    const registerPayload = {
      registerUploadRequest: {
        owner: userURN,
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
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
    const imageUrn = registerData.value.asset;
    const contentType = file.key.endsWith(".png") ? "image/png" : "image/jpeg";

    await axios.put(uploadUrl, fileBlob, {
      headers: {
        "Content-Type": contentType,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const postPayload = {
      author: userURN,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.caption?.trim() || "Here's an image I wanted to share",
          },
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              media: imageUrn,
              title: { text: "Image" },
              description: { text: "Image description for accessibility" },
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202402",
        },
      }
    );

    if (!content._id) throw new Error("Content ID is missing");
    console.log('linkedin post is on air....')

    return { name: PLATFORMS.LINKEDIN, status: "success", id: content._id.toString() };

  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("LinkedIn post failed:", errorMessage);
    throw new Error(errorMessage);
  }
}
