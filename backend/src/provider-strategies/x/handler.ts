import { uploadXThought } from "@/media-service";
import { CONTENT_TYPE } from "@/utils/constants";
import { IBucket } from "@/types";

export async function handleXUpload(
  content: IBucket,
  access_token: string
): Promise<{ name: string, status: string, id: string }> {
  switch (content.contentType) {
    case CONTENT_TYPE.THOUGHT:
      return await uploadXThought(access_token, content);
    default:
      throw new Error(`Unsupported content type`);
  }
}
