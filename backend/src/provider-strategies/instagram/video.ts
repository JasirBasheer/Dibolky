

// export async function uploadIGVideo(
//   content: IBucket,
//   accessToken: string, 
// ): Promise<{ name: string; status: string; id: string; postId?: string; error?: string }> {
//   if (content.files.length !== 1) {
//     return {
//       name: "Instagram",
//       status: "failed",
//       id: content._id as string,
//       error: "Only one video file is supported for Instagram video posts.",
//     };
//   }
//   if (!content.metaAccountId) {
//     return {
//       name: "Instagram",
//       status: "failed",
//       id: content._id as string,
//       error: "Facebook Page ID (metaAccountId) is required to find associated Instagram account.",
//     };
//   }

//   const originalFileKey = content.files[0].key;
//   const transcodedFileKey = `transcoded_for_instagram/${path.basename(originalFileKey)}`; // New S3 key for transcoded video

//   try {
//     const pages = await getPages(accessToken);
//     const page = pages.data.find((item: { id: string }) => item.id === content.metaAccountId);

//     if (!page) {
//       throw new NotFoundError(`Facebook Page with ID '${content.metaAccountId}' not found.`);
//     }

//     const pageId = page.id;
//     const pageAccessToken = page.access_token;

//     const instagramBusinessAccount = await fetchIGAccountId(pageId, pageAccessToken);
//     const instagramBusinessAccountId = instagramBusinessAccount.id;

//     if (!instagramBusinessAccountId) {
//       throw new Error(`No Instagram Business Account found linked to Facebook Page ID: ${pageId}. Ensure the page is connected to an Instagram Business Account and your app has 'instagram_basic' permission.`);
//     }

//     // --- Before attempting Instagram upload, transcode the video ---
//     console.log(`[Main] Initiating video transcoding for Instagram: ${originalFileKey}`);
//     const transcodedVideoUrl = await transcodeVideoForInstagram({
//         inputS3Key: originalFileKey,
//         outputS3Key: transcodedFileKey,
//         bucketName: "dibolky-test-app", // Your S3 bucket name
//         caption: content.caption || "test", // Pass caption if needed for FFmpeg metadata (less common)
//     });
//     console.log(`[Main] Transcoding complete. Transcoded video URL: ${transcodedVideoUrl}`);

//     // Now, proceed with Instagram upload using the transcoded video URL
//     const INSTAGRAM_VIDEO_LIMIT = 300 * 1024 * 1024; // This check is now less critical as FFmpeg handles it, but good to keep.
//     const { contentType } = await getMediaDetails(transcodedFileKey, INSTAGRAM_VIDEO_LIMIT); // Check transcoded file type

//     // The URL is already from transcodeVideoForInstagram
//     // const { contentType, url: videoUrl } = await getMediaDetails(transcodedFileKey, INSTAGRAM_VIDEO_LIMIT); // This line becomes redundant if transcodedVideoUrl is direct

//     if (contentType !== "video/mp4") {
//       throw new Error("Transcoded file is not MP4. Something went wrong during transcoding.");
//     }

//     console.log(`Attempting to post transcoded video to Instagram via Business Account ID: ${instagramBusinessAccountId}`);
//     console.log(`Transcoded video URL for IG: ${transcodedVideoUrl}`);

//     // Step 1: Create an Instagram media container
//     const igCreateContainerResponse = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${instagramBusinessAccountId}/media`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         media_type: "VIDEO",
//         video_url: transcodedVideoUrl, // Use the URL of the transcoded video
//         caption: content.caption || "test",
//         access_token: pageAccessToken,
//       }),
//     });

//     if (!igCreateContainerResponse.ok) {
//       const errorData = await igCreateContainerResponse.json();
//       throw new Error(`Failed to create Instagram media container: ${errorData.error.message}`);
//     }
//     const igCreateContainerData = await igCreateContainerResponse.json();
//     const creationId = igCreateContainerData.id;

//     // Step 2: Check container status (Crucial for videos)
//     // (Assuming checkIGContainerStatus is defined as a separate helper)
//     await checkIGContainerStatus(pageAccessToken, creationId);

//     // Step 3: Publish the Instagram media container
//     const igPublishResponse = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${instagramBusinessAccountId}/media_publish`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         creation_id: creationId,
//         access_token: pageAccessToken,
//       }),
//     });

//     if (!igPublishResponse.ok) {
//       const errorData = await igPublishResponse.json();
//       throw new Error(`Failed to publish Instagram video: ${errorData.error.message}`);
//     }
//     const igPublishData = await igPublishResponse.json();
//     console.log(`Instagram video posted with ID: ${igPublishData.id}`);
//     return {
//       name: "Instagram",
//       status: "success",
//       id: content._id as string,
//       postId: igPublishData.id,
//     };

//   } catch (error: any) {
//     console.error(`Error posting Instagram video: ${error.message}`);
//     return {
//       name: "Instagram",
//       status: "failed",
//       id: content._id as string,
//       error: `Error posting Instagram video: ${error.message}`,
//     };
//   } finally {
//       // Optional: Clean up transcoded file from S3 if it's no longer needed after successful upload
//       // This logic would need to be very careful to not delete files that might be used elsewhere.
//       // Consider a lifecycle policy on the S3 bucket for the 'transcoded_for_instagram' prefix.
//   }
// }
