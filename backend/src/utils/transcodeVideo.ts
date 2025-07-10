import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { createReadStream, createWriteStream, promises as fsPromises } from 'fs'; 
import { getS3PublicUrl } from './aws.utils';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/config/aws.config';

// Assuming getS3PublicUrl is defined and works to fetch a direct download URL
// Also assuming you have a way to download the file locally if needed,
// or that FFmpeg can directly read from S3 (requires FFmpeg compiled with S3 support, or pre-signed URLs)

// For demonstration, let's assume `getS3PublicUrl` gives a direct public URL
// and we will download it locally first, then transcode.
// In a real scenario, consider streaming directly or using pre-signed URLs for FFmpeg.

export interface TranscodeOptions {
    inputS3Key: string;
    outputS3Key: string; // Key for the transcoded video on S3
    bucketName: string;
    caption: string; // Or other metadata if needed
    // Add any specific Instagram constraints if not handled by default FFmpeg command
}

/**
 * Transcodes a video for Instagram compatibility using FFmpeg.
 * This function should ideally be run by a dedicated worker service.
 *
 * @param options Transcoding options including S3 keys and bucket.
 * @returns A Promise that resolves when transcoding and S3 upload are complete, or rejects on error.
 */
export async function transcodeVideoForInstagram(options: TranscodeOptions): Promise<string> {
    const { inputS3Key, outputS3Key, bucketName } = options;

    const DOWNLOAD_DIR = path.join(__dirname, 'temp_downloads'); // Temporary directory for downloads
    const UPLOAD_DIR = path.join(__dirname, 'temp_uploads'); // Temporary directory for transcoded files
        await fsPromises.mkdir(DOWNLOAD_DIR, { recursive: true });
        await fsPromises.mkdir(UPLOAD_DIR, { recursive: true });


    const inputLocalPath = path.join(DOWNLOAD_DIR, path.basename(inputS3Key));
    const outputLocalPath = path.join(UPLOAD_DIR, `instagram_${path.basename(inputS3Key)}`);

    try {
        console.log(`[Transcoder] Starting transcoding job for: ${inputS3Key}`);

        const getObjectCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: inputS3Key,
        });
        const { Body } = await s3Client.send(getObjectCommand);

        if (!Body) {
            throw new Error(`[Transcoder] No body found for S3 object: ${inputS3Key}`);
        }

        const writeStream = createWriteStream(inputLocalPath);
        // Using `await pipeline` for robust streaming (Node.js 15+)
        // Or manually pipe for older versions: Body.pipe(writeStream);
        await new Promise<void>((resolve, reject) => { // Explicitly type the Promise to void
            (Body as any).pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject);
        });
              console.log(`[Fluent Transcoder] Downloaded ${inputS3Key} to ${inputLocalPath}`);

        console.log(`[Fluent Transcoder] Executing FFmpeg (via fluent-ffmpeg) for: ${inputLocalPath}`);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputLocalPath)
                .videoCodec('libx264')
                .preset('medium')
                .outputOptions([
                    '-crf 23',
                    '-c:a aac',
                    '-b:a 128k',
                    `-vf scale='min(1080,iw)':-1`, // Note: -vf needs to be a single string here
                    '-r 30',
                    '-movflags +faststart',
                    '-y' // Overwrite output file if it exists
                ])
                .on('start', (commandLine) => {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('progress', (progress) => {
                    // console.log('Processing: ' + progress.percent + '% done'); // Optional: log progress
                })
                .on('end', () => {
                    console.log('[Fluent Transcoder] Transcoding finished successfully.');
                    resolve();
                })
                .on('error', (err, stdout, stderr) => {
                    console.error('[Fluent Transcoder] FFmpeg error: ' + err.message);
                    console.error('FFmpeg stdout:\n' + stdout);
                    console.error('FFmpeg stderr:\n' + stderr);
                    reject(new Error(`FFmpeg error: ${err.message}. Stderr: ${stderr}`));
                })
                .save(outputLocalPath);
        });

        console.log(`[Fluent Transcoder] Transcoding complete. Uploading to S3: ${outputS3Key}`);

        const uploadCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: outputS3Key,
            Body: createReadStream(outputLocalPath),
            ContentType: 'video/mp4',
        });
        await s3Client.send(uploadCommand);
        console.log(`[Fluent Transcoder] Uploaded ${outputLocalPath} to S3 successfully.`);


        return await getS3PublicUrl(outputS3Key);

    } catch (error: any) {
        console.error(`[Transcoder] Error during transcoding or S3 operations: ${error.message}`);
        throw error; // Re-throw the error for the caller to handle
    } finally {
        // Clean up temporary files
        try {
            await fsPromises.rm(inputLocalPath, { force: true });
            await fsPromises.rm(outputLocalPath, { force: true });
            console.log(`[Transcoder] Cleaned up temporary files.`);
        } catch (cleanupError) {
            console.error(`[Transcoder] Error during cleanup: ${cleanupError}`);
        }
    }
}