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
