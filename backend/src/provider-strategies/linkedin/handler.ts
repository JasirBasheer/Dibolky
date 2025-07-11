import { IBucket } from "@/types";
import { CONTENT_TYPE } from "@/utils/constants";
import { uploadLinkedinPost, uploadLinkedinThought, uploadLinkedinVideo } from "@/media-service";


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
