import { fetchIGAccountId } from "@/providers/meta/instagram";
import { IBucket } from "@/types";
import { getPages } from "./shared";
import { NotFoundError } from "mern.common";
import { publishFaceBookImageStory, publishFaceBookVideoStory } from "@/providers/meta/facebook/contents/story";
import { getMediaDetails, PLATFORMS } from "@/utils";
import { publishInstagramStory } from "@/providers/meta/instagram/contents/story";

// INSTAGRAM STORY
export async function uploadIGStory(
  content: IBucket,
  accessToken: string
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  if (content.files.length !== 1) return { name: PLATFORMS.INSTAGRAM, status: "failed", id: content._id as string, error: "Instagram Stories support only one media file per post" };
  if (!content.metaAccountId) return {name: PLATFORMS.INSTAGRAM, status: "failed", id: content._id as string, error: "Instagram Business Account ID (metaAccountId) is required"};

  try {
    const igUser = await fetchIGAccountId(content.metaAccountId, accessToken);
    const { contentType, url } = await getMediaDetails(content.files[0].key);
    if (!url) throw new Error("s3 URL is missing");
   
    return await publishInstagramStory(contentType, url,igUser.id,accessToken,content._id as string)
  } catch (error: any) {
    return { name: PLATFORMS.INSTAGRAM, status: "failed", id: content._id as string, error: `Error posting Instagram Story: ${error.message}`};
  }
}



// FACEBOOK STORY
export async function uploadFaceBookStory(
  accessToken: string,
  content: IBucket,
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  if (content.files.length !== 1) return { name: PLATFORMS.FACEBOOK, status: "failed", id: content._id as string, error: "Facebook Stories support only one media file per post" }
  if (!content.metaAccountId) return { name: PLATFORMS.FACEBOOK, status: "failed", id: content._id as string, error: "Facebook Page ID (metaAccountId) is required" };

  try {
    const pages = await getPages(accessToken);
    const page = pages.data.find((item: { id: string }) => item.id == content.metaAccountId);
    if (!page) throw new NotFoundError("Meta page not found");

    const pageId = content.metaAccountId;
    const { contentType, url } = await getMediaDetails(content.files[0].key);
    if(!url) throw new NotFoundError("s3 url not found")


    if (contentType === "image/jpeg") {
     return await publishFaceBookImageStory(pageId,page.access_token,url,content._id as string)
    } else if (contentType === "video/mp4") {
      return await publishFaceBookVideoStory(pageId,page.access_token,url,content._id as string)
    } else {
      return { name: PLATFORMS.FACEBOOK, status: "failed", id: content._id as string, error: "Unsupported media type for Facebook Story."};
    }

  } catch (error: any) {
    return { name: PLATFORMS.FACEBOOK, status: "failed", id: content._id as string, error: `Error posting Facebook Story: ${error.message}`};
  }
}