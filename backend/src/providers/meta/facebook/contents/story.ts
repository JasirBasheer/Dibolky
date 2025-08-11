import axios from 'axios';

export async function publishFaceBookImageStory(
  pageId: string,
  accessToken: string,
  url: string,
  contentId: string
): Promise<{name: string, status: string, id: string, postId?: string , error?: string}> {
  try {
    const photoUploadUrl = `https://graph.facebook.com/v21.0/${pageId}/photos`;
    const storyPublishUrl = `https://graph.facebook.com/v21.0/${pageId}/photo_stories`;

    const { data: uploadPhotoData } = await axios.post(photoUploadUrl, {
      url: url,
      published: false,
      access_token: accessToken,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data: publishData } = await axios.post(storyPublishUrl, {
      photo_id: uploadPhotoData.id,
      access_token: accessToken,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { name: "Facebook", status: "success", id: contentId as string, postId: publishData.id};

  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    return { name: "Facebook", status: "failed", id: contentId as string, error: `Failed to publish Facebook Photo Story: ${errorMessage}`};
  }
}



export async function publishFaceBookVideoStory(
  pageId: string,
  accessToken: string,
  url: string,
  contentId: string
): Promise<{name: string, status: string, id: string, postId?: string , error?: string}> {
  try {
    const baseUrl = `https://graph.facebook.com/v21.0/${pageId}/video_stories`;

    const { data: initUploadData } = await axios.post(baseUrl, {
      upload_phase: "start",
      access_token: accessToken,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const videoId = initUploadData.video_id;
    const uploadUrl = initUploadData.upload_url;

    await axios.post(uploadUrl, null, {
      headers: {
        "file_url": url,
        "Authorization": `OAuth ${accessToken}`,
      },
    });

    const { data: publishData } = await axios.post(baseUrl, {
      upload_phase: "finish",
      video_id: videoId,
      access_token: accessToken,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {name: "Facebook", status: "success", id: contentId as string, postId: publishData.id};

  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    return { name: "Facebook", status: "failed", id: contentId as string, error: `Failed to publish Facebook Video Story: ${errorMessage}`};
  }
}
