import { S3Client } from "@aws-sdk/client-s3";
import {AWS_S3_BUCKET_ACCESS_KEY, AWS_S3_BUCKET_REGION, AWS_S3_BUCKET_SECRET_KEY } from "./env";

const s3Client = new S3Client({
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_S3_BUCKET_ACCESS_KEY,
    secretAccessKey: AWS_S3_BUCKET_SECRET_KEY
  }
});

export default s3Client;