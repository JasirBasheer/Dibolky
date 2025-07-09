import fs from 'fs';
import { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } from "@/config";


export async function createLinkedInOAuthURL(
    redirectUri: string
): Promise<string> {
   const state = 'RANDOM_STRING';
   const SCOPE = 'openid profile email w_member_social';

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(SCOPE)}&state=${state}`;
    return authUrl;

}



export async function linkedInAuthCallback(
    code:string,state:string
): Promise<string> {


 const params = new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  redirect_uri: "http://localhost:5173/agency/settings?provider=linkedin",
  client_id: "860d6lbkibt1yl",
  client_secret: "WPL_AP1.AItcn3sdq2DxSfYJ.AlOXhg==",
});


const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: params.toString(),
});

  if (!response.ok) {
  const errorData = await response.json();
  console.error('LinkedIn API Error:', errorData);
  throw new Error(`Failed to get access token: ${errorData.error_description || 'Unknown error'}`);
}

  const data = await response.json();
  return data.access_token
}



async function getUserURN(accessToken: string): Promise<string> {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': '202506', 
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch user info: ${errorData.message}`);
  }

  const data = await response.json();
  return `urn:li:person:${data.sub}`;
}


export async function getLinkedInTokenStatus(accessToken: string): Promise<boolean> {
    try {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'LinkedIn-Version': '202506',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (response.ok) {
      console.log('Access token is valid');
      return true;
    }

    const errorData = await response.json();
    console.error('Access token validation failed:', errorData);
    return false;
  } catch (error : any) {
    console.error('Error validating access token:', error.message);
    return false;
  }

}





async function postLinkedInText(accessToken: string, userURN: string, text: string): Promise<string> {
  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202506',
    },
    body: JSON.stringify({
      author: userURN,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to post text: ${errorData.message}`);
  }

  const postId = response.headers.get('x-restli-id');
  return postId || 'Post created successfully';
}



async function postLinkedInImage(accessToken: string, userURN: string, imagePath: string, text: string): Promise<string> {
  // Step 1: Register image upload
  const registerResponse = await fetch('https://api.linkedin.com/rest/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202506',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        owner: userURN,
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        serviceRelationships: [{ identifier: 'urn:li:userGeneratedContent', relationshipType: 'OWNER' }],
        supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
      },
    }),
  });

  if (!registerResponse.ok) {
    const errorData = await registerResponse.json();
    throw new Error(`Failed to register image: ${errorData.message}`);
  }

  const registerData = await registerResponse.json();
  const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const imageUrn = registerData.value.asset;

  // Step 2: Upload image
  const imageBuffer = fs.readFileSync(imagePath);
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: imageBuffer,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image');
  }

  // Step 3: Create post
  const postResponse = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202506',
    },
    body: JSON.stringify({
      author: userURN,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
      content: {
        media: {
          id: imageUrn,
          title: 'My Image',
          altText: 'Description of the image for accessibility',
        },
      },
    }),
  });

  if (!postResponse.ok) {
    const errorData = await postResponse.json();
    throw new Error(`Failed to post image: ${errorData.message}`);
  }

  const postId = postResponse.headers.get('x-restli-id');
  return postId || 'Image post created successfully';
}




async function postLinkedInVideo(accessToken: string, userURN: string, videoPath: string, text: string): Promise<string> {
  // Step 1: Register video upload
  const registerResponse = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202506',
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: userURN,
        fileSizeBytes: fs.statSync(videoPath).size,
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    }),
  });

  if (!registerResponse.ok) {
    const errorData = await registerResponse.json();
    throw new Error(`Failed to register video: ${errorData.message}`);
  }

  const registerData = await registerResponse.json();
  const uploadUrl = registerData.value.uploadInstructions[0].uploadUrl;
  const videoUrn = registerData.value.video;

  // Step 2: Upload video
  const videoBuffer = fs.readFileSync(videoPath);
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
    },
    body: videoBuffer,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload video');
  }

  // Step 3: Create post
  const postResponse = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202506',
    },
    body: JSON.stringify({
      author: userURN,
      commentary: text,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
      content: {
        media: {
          id: videoUrn,
          title: 'My Video',
        },
      },
    }),
  });

  if (!postResponse.ok) {
    const errorData = await postResponse.json();
    throw new Error(`Failed to post video: ${errorData.message}`);
  }

  const postId = postResponse.headers.get('x-restli-id');
  return postId || 'Video post created successfully';
}