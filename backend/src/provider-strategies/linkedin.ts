import fs from "fs";
import {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI,
} from "@/config";
import { IBucket } from "@/types";
import { CONTENT_TYPE, LINKEDIN } from "@/utils/constants.utils";
import { getS3PublicUrl } from "@/utils/aws.utils";
import { AuthorizationCode } from "simple-oauth2";
import axios from "axios";
export async function createLinkedInOAuthURL(
  redirectUri: string
): Promise<string> {
  const state = "RANDOM_STRING";
  const SCOPE = "openid profile email w_member_social";

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=860d6lbkibt1yl&redirect_uri=${encodeURIComponent(
    "http://localhost:5173/agency/settings?provider=linkedin"
  )}&scope=${encodeURIComponent(SCOPE)}&state=${state}`;
  return authUrl;
}

export async function linkedInAuthCallback(code: string, state: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: "http://localhost:5173/agency/settings?provider=linkedin",
    client_id: "860d6lbkibt1yl",
    client_secret: "WPL_AP1.49hDNsCUCE92QHKR.BCD4wQ=="
  });

  const client = new AuthorizationCode({
    client: {
      id: "860d6lbkibt1yl",
      secret: "WPL_AP1.49hDNsCUCE92QHKR.BCD4wQ=="
    },
    auth: {
      tokenHost: "https://www.linkedin.com",
      tokenPath: "/oauth/v2/accessToken",
      authorizePath: "/oauth/v2/authorization"
    },
    options: {
      authorizationMethod: "body"
    }
  });
const tokenParams = {
    code,
    redirect_uri: "http://localhost:5173/agency/settings?provider=linkedin"
  };

  try {
    const accessToken = await client.getToken(tokenParams);
    await new Promise((resolve) => setTimeout(resolve, 15000));
    return accessToken.token.access_token as string
  } catch (error:any) {
    console.error("LinkedIn OAuth Error:", error.message);
    throw new Error("Failed to get access token");
  }
}

async function getUserURN(accessToken: string): Promise<string> {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "LinkedIn-Version": "202506",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch user info: ${errorData.message}`);
  }

  const data = await response.json();
  return `urn:li:person:${data.sub}`;
}

export async function getLinkedInTokenStatus(accessToken: string): Promise<boolean> {
  try {
    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "LinkedIn-Version": "202506",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    });

    console.log("Response Status:", response.status, response.statusText);
    console.log("Response Data:", response.data);

    if (response.status >= 200 && response.status < 300) {
      console.log("Access token is valid");
      return true;
    }

    console.error("Access token validation failed:", response.data);
    return false;
  } catch (error: any) {
    console.error("Error validating access token:", error);
    return false;
  }
}

async function uploadLinkedinThought(
  accessToken: string,
  content: IBucket
): Promise<{name:string, status:string, id:string}> {
  const userURN = await getUserURN(accessToken);
  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202506",
    },
    body: JSON.stringify({
      author: userURN,
      commentary: content.caption,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to post text: ${errorData.message}`);
  }

  return {
    name: LINKEDIN,
    status: "success",
    id: content._id as string,
  };
}

async function uploadLinkedinPost(
  accessToken: string,
  content: IBucket
): Promise<{name:string, status:string, id:string}> {
  const userURN = await getUserURN(accessToken);
  console.log(userURN,"user urn nnnnn")
const mediaItems: { id: string; title: string; altText: string }[] = [];

  const file = content.files[0];
  const filePath = await getS3PublicUrl(file.key);
  const fileResponse = await fetch(filePath);
  if (!fileResponse.ok) {
    throw new Error(`Failed to fetch file from S3: ${filePath}`);
  }
  const fileBlob = await fileResponse.blob();

  const registerResponse = await fetch(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202402", 
      },
      body: JSON.stringify({
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
      }),
    }
  );

  if (!registerResponse.ok) {
    const errorData = await registerResponse.json();
    console.error("Register error:", JSON.stringify(errorData, null, 2));
    throw new Error(`Failed to register image: ${errorData.message}`);
  }

  const registerData = await registerResponse.json();
  const uploadUrl =
    registerData.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;
  const imageUrn = registerData.value.asset;

  // Upload the image
  const contentType = file.key.endsWith(".png") ? "image/png" : "image/jpeg";
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: fileBlob,
  });

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.text();
    console.error("Upload error:", errorData);
    throw new Error(`Failed to upload image: ${filePath}`);
  }

  const postResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202402", 
    },
    body: JSON.stringify({
      author: userURN,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.caption || "Default caption",
          },
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              media: imageUrn,
              title: {
                text: "Image",
              },
              description: {
                text: "Image description for accessibility",
              },
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });

  if (!postResponse.ok) {
    const errorData = await postResponse.json();
    console.error("Post error:", JSON.stringify(errorData, null, 2));
    throw new Error(`Failed to post: ${errorData.message}`);
  }

  if (!content._id) {
    throw new Error("Content ID is missing");
  }

  return {
    name: "LINKEDIN",
    status: "success",
    id: content._id.toString(),
  };
}

async function uploadLinkedinVideo(
  accessToken: string,
  content: IBucket
): Promise<{ name: string; status: string; id: string }> {

  if (!content.files || content.files.length === 0) {
    throw new Error("No video file provided");
  }
  if (!content._id) {
    throw new Error("Content ID is missing");
  }

  const userURN = await getUserURN(accessToken);
  if (!userURN || !userURN.startsWith("urn:li:person:")) {
    throw new Error("Invalid or missing user URN");
  }
  console.log(userURN, "user URN");

  try {
    const file = content.files[0];
    const filePath = await getS3PublicUrl(file.key);
    const fileResponse = await fetch(filePath);
    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch video from S3: ${filePath}`);
    }
    const fileBlob = await fileResponse.blob();

    const registerResponse = await fetch(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202402", 
        },
        body: JSON.stringify({
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
        }),
      }
    );

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.error(`Register error for video ${file.key}:`, JSON.stringify(errorData, null, 2));
      throw new Error(`Failed to register video: ${errorData.message}`);
    }

    const registerData = await registerResponse.json();
    const uploadUrl =
      registerData.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const videoUrn = registerData.value.asset;

    const contentType = file.key.endsWith(".mp4") ? "video/mp4" : "video/mpeg";
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: fileBlob,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error(`Upload error for video ${file.key}:`, errorData);
      throw new Error(`Failed to upload video: ${filePath}`);
    }

    const postResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202402", 
      },
      body: JSON.stringify({
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
                title: {
                  text: "Video",
                },
                description: {
                  text: "Video description for accessibility",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      console.error(`Post error for video ${file.key}:`, JSON.stringify(errorData, null, 2));
      if (postResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to post: ${errorData.message}`);
    }

    return {
      name: LINKEDIN,
      status: "success",
      id: content._id.toString(),
    };
  } catch (error) {
    console.error(`Error processing video ${content.files[0]?.key || "unknown"}:`, error);
    return {
      name: LINKEDIN,
      status: "error",
      id: content._id?.toString() || "unknown",
    };
  }
}

export async function handleLinkedinUpload(
  content: IBucket,
  access_token: string
): Promise<{ name: string, status: string, id: string }> {
  switch (content.contentType) {
    case CONTENT_TYPE.THOUGHT:
      return await uploadLinkedinThought(access_token, content);
    case CONTENT_TYPE.POST:
      return await uploadLinkedinPost(access_token, content);
    case CONTENT_TYPE.REEL:
    case CONTENT_TYPE.VIDEO:
      return await uploadLinkedinVideo(access_token, content);
    default:
      throw new Error(`Unsupported content type`);
  }
}
