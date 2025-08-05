import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

const s3Client = new S3Client({
  region: env.AWS.S3.REGION,
  credentials: {
    accessKeyId: env.AWS.S3.ACCESS_KEY,
    secretAccessKey: env.AWS.S3.SECRET_KEY
  }
});

export default s3Client;
