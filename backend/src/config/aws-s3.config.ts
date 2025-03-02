import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {AWS_S3_BUCKET_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_S3_BUCKET_REGION, AWS_S3_BUCKET_SECRET_KEY } from "./env";

const s3Client = new S3Client({
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_S3_BUCKET_ACCESS_KEY,
    secretAccessKey: AWS_S3_BUCKET_SECRET_KEY
  }
});

export default s3Client;



export async function getS3ViewUrl(
  key: string
): Promise< string > {

  const getObjectParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
  };
  
  const command = new GetObjectCommand(getObjectParams);
  const viewURL = await getSignedUrl(s3Client, command, { expiresIn: 86400 }); 
  return viewURL;
}


export async function getS3PublicUrl(key: string): Promise<string> {
  return `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(key)}`;
}