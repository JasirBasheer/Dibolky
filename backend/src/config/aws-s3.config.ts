import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import {AWS_S3_BUCKET_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_S3_BUCKET_REGION, AWS_S3_BUCKET_SECRET_KEY } from "./env";

const s3Client = new S3Client({
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_S3_BUCKET_ACCESS_KEY,
    secretAccessKey: AWS_S3_BUCKET_SECRET_KEY
  }
});

export default s3Client;


export async function getS3UploadUrl(
  fileName: string, 
  fileType: string
): Promise<{ uploadURL: string, key: string }> {
  const key = `uploads/${Date.now()}-${fileName}`;
  
  const putObjectParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType
  };
  
  const command = new PutObjectCommand(putObjectParams);
  const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 }); 
  
  return { uploadURL, key };
}


export async function getS3ViewUrl(
  key: string
): Promise<{ viewURL: string }> {
  const getObjectParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: key
  };
  
  const command = new GetObjectCommand(getObjectParams);
  const viewURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); 
  
  return { viewURL };
}