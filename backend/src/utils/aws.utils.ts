import s3Client from "../config/aws.config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_S3_BUCKET_NAME } from "../config/env";


export async function getS3ViewUrl(
    key: string
): Promise<string> {
    if(key == "")return 
    const getObjectParams = {
        Bucket: "dibolky-test-app",
        Key: key,
    };

    const command = new GetObjectCommand(getObjectParams);
    const viewURL = await getSignedUrl(s3Client, command, { expiresIn: 86400 });
    return viewURL;
}


export async function getS3PublicUrl(
    key: string
): Promise<string> {
    return `https://dibolky-test-app.s3.amazonaws.com/${encodeURIComponent(key)}`;
}

export async function deleteS3Object(
    key: string
): Promise<boolean> {
    try {
        const deleteParams = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error("Error deleting object from S3:", error);
        return false;
    }
}


// export const uploadToS3 = async (file: File, key: string, bucketName?: string) => {
//     if (!bucketName) {
//         throw new Error("Bucket name is required.");
//     }

//     console.log("Uploading to:", key, "in bucket:", bucketName);

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const params = {
//         Bucket: bucketName,
//         Key: key,
//         Body: buffer,
//         ContentType: file.type
//         };

//     try {
//         console.log("Upload started...");
//         const command = new PutObjectCommand(params);
//         const response = await s3Client.send(command);

//         console.log("Upload response:", response);

//         const region = AWS_REGION; 
//         const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

//         console.log("File URL:", url);

//         return url;
//     } catch (error) {
//         console.error("S3 Upload Error:", error);
//         throw error;
//     }
// };


