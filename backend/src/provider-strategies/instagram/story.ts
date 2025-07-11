import axios from "axios";

export async function publishInstagramStory(
  contentType: string,
  url: string,
  igUserId: string,
  accessToken: string,
  contentId: string
): Promise<{ name: string, status: string, id: string, postId?: string, error?: string }> {
  try {
    const formData = new FormData();
    formData.append("media_type", "STORIES");

    if (contentType === "image/jpeg") {
      formData.append("image_url", url);
    } else if (contentType === "video/mp4") {
      formData.append("video_url", url);
    }

    formData.append("access_token", accessToken);

    const { data: uploadData } = await axios.post(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      formData
    );

    const { data: publishData } = await axios.post(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        creation_id: uploadData.id,
        access_token: accessToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { name: "Instagram", status: "success", id: contentId as string, postId: publishData.id };

  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    return { name: "Instagram", status: "failed", id: contentId as string, error: `Failed to publish Instagram Story: ${errorMessage}`};
  }
}
