import s3Client from "@/config/aws.config";
import { fetchIGAccountId } from "@/provider-strategies/instagram";
import { IBucket } from "@/types";
import { GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { getPages } from "./shared";
import { getS3PublicUrl } from "@/utils/aws.utils";
import { NotFoundError } from "mern.common";

async function getMediaDetails(fileKey: string): Promise<{
  contentType: string;
  size: number;
  url?: string;
}> {
  try { 
    const command = new GetObjectCommand({
      Bucket: "dibolky-test-app", // Replace with your actual bucket name
      Key: fileKey,
    });
    const response: GetObjectCommandOutput = await s3Client.send(command);

    if (!response.Body) {
      throw new Error(`S3 object '${fileKey}' has no body (possibly empty or access denied).`);
    }

    const contentType = response.ContentType ?? "application/octet-stream";
    if (!["image/jpeg", "video/mp4"].includes(contentType)) {
      throw new Error("Unsupported media type. Only JPEG images and MP4 videos are supported.");
    }

    const size = response.ContentLength ?? 0;
    if (contentType === "image/jpeg" && size > 8 * 1024 * 1024) {
      throw new Error("Image exceeds 8 MB limit.");
    }
    if (contentType === "video/mp4" && size > 100 * 1024 * 1024) {
      throw new Error("Video exceeds 100 MB limit.");
    }

      const url = await getS3PublicUrl(fileKey)
      return { contentType, size, url }; 
  } catch (error: any) {
    throw new Error(`Failed to fetch media from S3: ${error.message}`);
  }
}

export async function uploadIGStory(
  content: IBucket,
  accessToken: string
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  if (content.files.length !== 1) {
    return {
      name: "Instagram",
      status: "failed",
      id: content._id as string,
      error: "Instagram Stories support only one media file per post",
    };
  }

  if (!content.metaAccountId) {
    return {
      name: "Instagram",
      status: "failed",
      id: content._id as string,
      error: "Instagram Business Account ID (metaAccountId) is required",
    };
  }

  try {
    const igUser = await fetchIGAccountId(content.metaAccountId, accessToken);
    const igUserId = igUser.id;
    const { contentType, url } = await getMediaDetails(content.files[0].key);

    // Step 1: Upload media
    const formData = new FormData();
    formData.append("media_type", "STORIES");
    if (contentType === "image/jpeg") {
       if (!url) throw new Error("Image URL is missing");
       formData.append("image_url", url);
    } else if (contentType === "video/mp4") {
      if (!url) throw new Error("Video URL is missing");
      formData.append("video_url", url);
    }
    formData.append("access_token", accessToken);

    const uploadResponse = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      return {
        name: "Instagram",
        status: "failed",
        id: content._id as string,
        error: `Failed to upload Story media: ${errorData.error.message}`,
      };
    }

    const uploadData = await uploadResponse.json();
    const creationId = uploadData.id;

    const publishResponse = await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media_publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      return {
        name: "Instagram",
        status: "failed",
        id: content._id as string,
        error: `Failed to publish Story: ${errorData.error.message}`,
      };
    }

    const publishData = await publishResponse.json();
    return {
      name: "Instagram",
      status: "success",
      id: content._id as string,
      postId: publishData.id,
    };
  } catch (error: any) {
    return {
      name: "Instagram",
      status: "failed",
      id: content._id as string,
      error: `Error posting Instagram Story: ${error.message}`,
    };
  }
}



export async function uploadFaceBookStory(
  accessToken: string,
  content: IBucket,
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  if (content.files.length !== 1) {
    return {
      name: "Facebook",
      status: "failed",
      id: content._id as string,
      error: "Facebook Stories support only one media file per post",
    };
  }

  if (!content.metaAccountId) {
    return {
      name: "Facebook",
      status: "failed",
      id: content._id as string,
      error: "Facebook Page ID (metaAccountId) is required",
    };
  }

  try {
    const pages = await getPages(accessToken);
    const page = pages.data.find((item: { id: string }) => item.id == content.metaAccountId);
    if (!page) throw new NotFoundError("Meta page not found");

    const pageId = content.metaAccountId;
    const { contentType, url } = await getMediaDetails(content.files[0].key);

    if (!url) {
      throw new Error("Media URL is missing from S3.");
    }

    let creationId: string; 

    if (contentType === "image/jpeg") {
      const uploadPhotoResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          url: url,
          published: false, 
          access_token: page.access_token,
        }),
      });

      if (!uploadPhotoResponse.ok) {
        const errorData = await uploadPhotoResponse.json();
        return {
          name: "Facebook",
          status: "failed",
          id: content._id as string,
          error: `Failed to upload photo for Facebook Story: ${errorData.error.message}`,
        };
      }
      const uploadPhotoData = await uploadPhotoResponse.json();
      creationId = uploadPhotoData.id; 

      const publishStoryResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photo_stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photo_id: creationId,
          access_token: page.access_token,
        }),
      });

      if (!publishStoryResponse.ok) {
        const errorData = await publishStoryResponse.json();
        return {
          name: "Facebook",
          status: "failed",
          id: content._id as string,
          error: `Failed to publish Facebook Photo Story: ${errorData.error.message}`,
        };
      }
      const publishData = await publishStoryResponse.json();
      return {
        name: "Facebook",
        status: "success",
        id: content._id as string,
        postId: publishData.id,
      };

    } else if (contentType === "video/mp4") {
      const initUploadResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}/video_stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upload_phase: "start",
          access_token: page.access_token,
        }),
      });

      if (!initUploadResponse.ok) {
        const errorData = await initUploadResponse.json();
        return {
          name: "Facebook",
          status: "failed",
          id: content._id as string,
          error: `Failed to initialize Facebook Video Story upload: ${errorData.error.message}`,
        };
      }
      const initUploadData = await initUploadResponse.json();
      const videoId = initUploadData.video_id;
      const uploadUrl = initUploadData.upload_url;

      const uploadVideoResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "file_url": url,
          "Authorization": `OAuth ${page.access_token}`,
        }
      });

      if (!uploadVideoResponse.ok) {
        const errorData = await uploadVideoResponse.json();
        return {
          name: "Facebook",
          status: "failed",
          id: content._id as string,
          error: `Failed to upload video file to Facebook Story: ${errorData.error.message}`,
        };
      }

      const publishStoryResponse = await fetch(`https://graph.facebook.com/v21.0/${pageId}/video_stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upload_phase: "finish",
          video_id: videoId,
          access_token: page.access_token,
        }),
      });

      if (!publishStoryResponse.ok) {
        const errorData = await publishStoryResponse.json();
        return {
          name: "Facebook",
          status: "failed",
          id: content._id as string,
          error: `Failed to publish Facebook Video Story: ${errorData.error.message}`,
        };
      }

      const publishData = await publishStoryResponse.json();
      return {
        name: "Facebook",
        status: "success",
        id: content._id as string,
        postId: publishData.id,
      };

    } else {
      return {
        name: "Facebook",
        status: "failed",
        id: content._id as string,
        error: "Unsupported media type for Facebook Story.",
      };
    }

  } catch (error: any) {
    return {
      name: "Facebook",
      status: "failed",
      id: content._id as string,
      error: `Error posting Facebook Story: ${error.message}`,
    };
  }
}