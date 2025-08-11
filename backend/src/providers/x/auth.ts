import { env } from "@/config";

const STATIC_CODE_VERIFIER = 'testcodeverifier1234567890';
const STATIC_CODE_CHALLENGE = STATIC_CODE_VERIFIER;

export async function createXAuthURL(
    redirectUri: string, state: string
): Promise<string> {
   const scope = encodeURIComponent('tweet.read tweet.write users.read offline.access');
   const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${env.X.CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${STATIC_CODE_CHALLENGE}&code_challenge_method=plain`;
   return authUrl;
}



export async function xAuthCallback(
    code:string,state:string
): Promise<{accessToken:string, refreshToken:string}> {
console.log("reached here",code, state)


  let redirect_uri = "";
  if (state === "client") {
    redirect_uri = `${env.BASE_URLS.FRONTEND}/client/integrations?provider=x`;
  } else {
    redirect_uri = `${env.BASE_URLS.FRONTEND}/agency/integrations?provider=x`;
  }
  

const params = new URLSearchParams({
  code,
  grant_type: 'authorization_code',
  client_id: env.X.CLIENT_ID,
  redirect_uri: redirect_uri,
  code_verifier: STATIC_CODE_VERIFIER,
});


const response = await fetch('https://api.twitter.com/2/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(`${env.X.CLIENT_ID}:${env.X.CLIENT_SECRET}`),  
  },
  body: params.toString(),
});

if (!response.ok) {
  let error = await response.json()
  console.log(error)
  throw new Error('Failed to get Twitter access token');
}

const data = await response.json();
console.log(data)

return {accessToken:data.access_token, refreshToken: data.refresh_token}
}


export async function isXAccessTokenValid(tokens: {accessToken?:string,refreshToken?:string}): Promise<boolean> {
  try {
    console.log(tokens)
    const response = await fetch('https://api.x.com/2/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
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
