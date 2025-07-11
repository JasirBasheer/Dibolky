import s3Client from "@/config/aws.config";
import { GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { getS3PublicUrl } from "./aws.utils";

export async function getMediaDetails(fileKey: string,platformMaxVideoSize?: number): Promise<{
  contentType: string;
  size: number;
  url?: string;
}> {
  try {
    const command = new GetObjectCommand({
      Bucket: "dibolky-test-app", 
      Key: fileKey,
    });
    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error(`S3 object '${fileKey}' has no body (possibly empty or access denied).`);
    }

    const contentType = response.ContentType ?? "application/octet-stream";
   if (!["image/jpeg", "video/mp4"].includes(contentType)) {
      throw new Error("Unsupported media type. Only JPEG images and MP4 videos are supported.");
    }

    const size = response.ContentLength ?? 0;
    const effectiveMaxVideoSize = platformMaxVideoSize ?? (8 * 1024 * 1024); 
    if (contentType === "video/mp4" && size > effectiveMaxVideoSize) {
      throw new Error(`Video exceeds ${effectiveMaxVideoSize / (1024 * 1024)} MB limit.`);
    }

    const url = await getS3PublicUrl(fileKey);
    return { contentType, size, url };
  } catch (error: any) {
    throw new Error(`Failed to fetch media from S3: ${error.message}`);
  }
}
