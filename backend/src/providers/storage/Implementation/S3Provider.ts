import { env } from "@/config";
import { IStorageProvider } from "../IStorageProvider";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/config/aws.config";
import { v4 as uuidv4 } from "uuid";

export class S3Provider implements IStorageProvider {
  async presign(
    fileName: string,
    fileType: string
  ): Promise<Record<string, string>> {
    const key = `test/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS.S3.BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      ContentDisposition: "inline",
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
      key,
      url,
      contentType: fileType,
    };
  }

  async signedS3Url(key: string): Promise<string> {
    if (key == "") return;
    const getObjectParams = {
      Bucket: "dibolky-test-app",
      Key: key,
    };

    const command = new GetObjectCommand(getObjectParams);
    return await getSignedUrl(s3Client, command, { expiresIn: 86400 });
  }
}
