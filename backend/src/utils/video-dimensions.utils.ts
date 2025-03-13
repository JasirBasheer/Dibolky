// import { ffprobe, FfprobeData, FfprobeStream } from 'fluent-ffmpeg';

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];




// interface VideoDimensions {
//     width: number;
//     height: number;
//     duration: number;
// }

// /**
//  * Get video dimensions using ffmpeg
//  * @param {string} videoPath - Local path or URL of the video
//  * @returns {Promise<VideoDimensions>}
//  */
// export async function getVideoDimensions(videoPath: string): Promise<VideoDimensions> {
//     return new Promise((resolve, reject) => {
//         ffprobe(videoPath, (err: Error | null, metadata: FfprobeData) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }

//             const videoStream = metadata.streams.find((stream: FfprobeStream) => 
//                 stream.codec_type === 'video'
//             );

//             if (!videoStream || !videoStream.width || !videoStream.height) {
//                 reject(new Error('Invalid video stream data'));
//                 return;
//             }

//             resolve({
//                 width: videoStream.width,
//                 height: videoStream.height,
//                 duration: metadata.format.duration || 0,
//             });
//         });
//     });
// }




// interface VideoAdjustment {
//     width: number;
//     height: number;
//     needsProcessing: boolean;
//     ffmpegCommand?: string;
// }

// export async function validateAndAdjustVideo(dimensions: { width: number; height: number }): Promise<VideoAdjustment> {
//     const MIN_HEIGHT = 960;
//     const MAX_HEIGHT = 1920;
//     const MIN_WIDTH = 540;
//     const MAX_WIDTH = 1080;

//     const currentRatio = dimensions.width / dimensions.height;
//     let needsProcessing = false;
//     let newWidth = dimensions.width;
//     let newHeight = dimensions.height;
//     let ffmpegCommand = '';

//     // Check if dimensions need adjustment
//     if (dimensions.height < MIN_HEIGHT) {
//         newHeight = MIN_HEIGHT;
//         newWidth = Math.round(MIN_HEIGHT * currentRatio);
//         needsProcessing = true;
//     } else if (dimensions.height > MAX_HEIGHT) {
//         newHeight = MAX_HEIGHT;
//         newWidth = Math.round(MAX_HEIGHT * currentRatio);
//         needsProcessing = true;
//     }

//     // Ensure width is within bounds
//     if (newWidth < MIN_WIDTH) {
//         newWidth = MIN_WIDTH;
//         newHeight = Math.round(MIN_WIDTH / currentRatio);
//         needsProcessing = true;
//     } else if (newWidth > MAX_WIDTH) {
//         newWidth = MAX_WIDTH;
//         newHeight = Math.round(MAX_WIDTH / currentRatio);
//         needsProcessing = true;
//     }

//     if (needsProcessing) {
//         ffmpegCommand = `ffmpeg -i input.mp4 -vf "scale=${newWidth}:${newHeight}" output.mp4`;
//     }

//     return {
//         width: newWidth,
//         height: newHeight,
//         needsProcessing,
//         ffmpegCommand
//     };
// }
