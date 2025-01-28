import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/aws-s3.config";
import { AWS_S3_BUCKET_REGION } from "../../config/env";

export const uploadToS3 = async (file: File, key: string, bucketName?: string) => {
    if (!bucketName) {
        throw new Error("Bucket name is required.");
    }

    console.log("Uploading to:", key, "in bucket:", bucketName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type
        };

    try {
        console.log("Upload started...");
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);

        console.log("Upload response:", response);

        const region = AWS_S3_BUCKET_REGION; 
        const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

        console.log("File URL:", url);

        return url;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
};
