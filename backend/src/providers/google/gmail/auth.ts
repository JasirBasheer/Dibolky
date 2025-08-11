import { env } from "@/config";
import axios from "axios";

export async function createGoogleOAuthURL(
    redirectUri: string
): Promise<string> {
const scopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email'
];
     const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${env.GOOGLE.MAIL.CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes.join(' '))}` +
    `&access_type=offline` +
    `&prompt=consent`;
    console.log(oauthUrl,"oauthurllll")
    return oauthUrl
}


export async function gmailAuthCallback(
    code:string
): Promise<{accessToken:string,refreshToken:string}> {

    if (!code) {
        throw new Error( 'Authorization code not provided.' );
    }
try {
    const redirect_uri = `${env.BASE_URLS.FRONTEND}${env.GOOGLE.MAIL.REDIRECT_URI}`
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: env.GOOGLE.MAIL.CLIENT_ID,
                client_secret: env.GOOGLE.MAIL.CLIENT_SECRET,
                redirect_uri, 
                grant_type: 'authorization_code',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
            return {accessToken:access_token, refreshToken:refresh_token}
    } catch (error) {
        console.log(error)
    }

}

export async function refreshGmailAccessToken(
    refreshToken: string
): Promise<{ accessToken: string; expiresIn: number } | null> {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: env.GOOGLE.MAIL.CLIENT_ID,
                client_secret: env.GOOGLE.MAIL.CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        
        if (data.error) return null;

        return {
            accessToken: data.access_token,
            expiresIn: data.expires_in,
        };
    } catch (error) {
        console.error('Error refreshing Google access token:', error);
        return null;
    }
}



export async function isGmailAccessTokenValid(
    tokens: {accessToken?:string,refreshToken?:string}
): Promise<boolean> {
    try {
        console.log(tokens,'tokens form gmail')
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${tokens.accessToken}`, { method: "GET" });
        console.log(response)
        
        if (!response.ok) return false;
        
        const tokenInfo = await response.json();
        if (tokenInfo.error) return false;
        
        const hasGmailScope = tokenInfo.scope?.includes('https://www.googleapis.com/auth/gmail.send');
        const hasEmailScope = tokenInfo.scope?.includes('https://www.googleapis.com/auth/userinfo.email');
        return hasGmailScope && hasEmailScope;
        
    } catch (error) {
        console.error('Error validating Google access token:', error);
        return false;
    }
}