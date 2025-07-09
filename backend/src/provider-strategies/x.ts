import { X_CLIENT_ID, X_CLIENT_SECRET, X_REDIRECT_URI } from "@/config";
const STATIC_STATE = 'teststate123';
const STATIC_CODE_VERIFIER = 'testcodeverifier1234567890';
const STATIC_CODE_CHALLENGE = STATIC_CODE_VERIFIER;

export async function createXAuthURL(
    redirectUri: string
): Promise<string> {
   const scope = encodeURIComponent('tweet.read tweet.write users.read offline.access');
   const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${STATIC_STATE}&code_challenge=${STATIC_CODE_CHALLENGE}&code_challenge_method=plain`;
   return authUrl;
}



export async function xAuthCallback(
    code:string,state:string
): Promise<string> {


const params = new URLSearchParams({
  code,
  grant_type: 'authorization_code',
  client_id: X_CLIENT_ID,
  redirect_uri: X_REDIRECT_URI,
  code_verifier: STATIC_CODE_VERIFIER,
});


const response = await fetch('https://api.twitter.com/2/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(`${X_CLIENT_ID}:${X_CLIENT_SECRET}`),  
  },
  body: params.toString(),
});

if (!response.ok) {
  throw new Error('Failed to get Twitter access token');
}

const data = await response.json();

return data.access_token
}


export async function isXAccessTokenValid(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.x.com/2/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('X access token is valid');
      return true;
    }

    const errorData = await response.json();
    console.error('X access token validation failed:', errorData);
    return false;
  } catch (error:any) {
    console.error('Error validating X access token:', error.message);
    return false;
  }
}