import s3Client from "../config/aws.config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/config";


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
    return `${env.AWS.S3.AWS_FOLDER_URI}/${encodeURIComponent(key)}`;
}

export async function deleteS3Object(
    key: string
): Promise<boolean> {
    try {
        const deleteParams = {
            Bucket: env.AWS.S3.BUCKET_NAME,
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

