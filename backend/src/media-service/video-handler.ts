import { IBucket } from "@/types";
import { getPages } from "./shared";
import { NotFoundError } from "mern.common";
import { getMediaDetails } from "@/utils";
import { publishFaceBookVideo } from "@/providers/meta/facebook";
import { getUserURN, publishLinkedinVideo } from "@/providers/linkedin";
import { getS3PublicUrl } from "@/utils/aws.utils";


// FACEBOOK VIDEO
export async function uploadFaceBookVideo(
  accessToken: string, 
  content: IBucket,
): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
  if (content.files.length !== 1) return { name: "Facebook", status: "failed", id: content._id as string, error: "Only one video file is supported." };
  if (!content.metaAccountId) return { name: "Facebook", status: "failed", id: content._id as string, error: "Facebook Page ID required." };

  const fileKey = content.files[0].key;
  try {
    const pages = await getPages(accessToken);
    const page = pages.data.find((item: { id: string }) => item.id === content.metaAccountId);
    if (!page) { throw new NotFoundError(`Facebook Page with ID '${content.metaAccountId}' not found.`); }

    const FACEBOOK_VIDEO_LIMIT = 1.75 * 1024 * 1024 * 1024; 
    const { contentType, url: videoUrl } = await getMediaDetails(fileKey, FACEBOOK_VIDEO_LIMIT);

    if (contentType !== "video/mp4") { throw new Error("Only MP4 videos are supported."); }
    if (!videoUrl) { throw new Error("S3 video URL is missing."); }
    return await publishFaceBookVideo(page.id,page.access_token,videoUrl,content)

  } catch (error: any) {
    console.error(`Error posting Facebook video: ${error.message}`);
    return { name: "Facebook", status: "failed", id: content._id as string, error: `Error posting Facebook video: ${error.message}` };
  }
}



// LINKEDIN VIDEO
export async function uploadLinkedinVideo(
  accessToken: string,
  content: IBucket
): Promise<{ name: string; status: string; id: string }> {

  if (!content.files || content.files.length === 0) throw new Error("No video file provided");
  if (!content._id) throw new Error("Content ID is missing");
  

  const userURN = await getUserURN(accessToken);
  if (!userURN || !userURN.startsWith("urn:li:person:")) {
    throw new Error("Invalid or missing user URN");
  }
  console.log(userURN, "user URN");

  try {
    const file = content.files[0];
    const filePath = await getS3PublicUrl(file.key);
    return await publishLinkedinVideo(filePath,accessToken,userURN,file,content)
    
  } catch (error) {
    console.error(`Error processing video ${content.files[0]?.key || "unknown"}:`, error);
    return { name: "linkedin", status: "error", id: content._id as string };
  }
}
