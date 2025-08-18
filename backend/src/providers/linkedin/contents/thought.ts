import { IBucket } from '@/types';
import { PLATFORMS } from '@/utils';
import axios from 'axios';

export async function publishLinkedinThought(
  content: IBucket,
  accessToken: string,
  userURN: string
): Promise<{ name: string; status: string; id: string }> {
  try {
    const payload = {
      author: userURN,
      commentary: content.caption,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    await axios.post(
      "https://api.linkedin.com/rest/posts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202506",
        },
      }
    );

    return { name: PLATFORMS.LINKEDIN, status: "success", id: content._id as string };

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error posting to LinkedIn:", errorMessage);
    throw new Error(`Failed to post text: ${errorMessage}`);
  }
}
