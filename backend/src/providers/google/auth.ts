import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "@/config";
import axios from "axios";
import { google } from "googleapis"
import base64url from "base64url"

export async function createGoogleOAuthURL(
    redirectUri: string
): Promise<string> {
    const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/userinfo.email'];
     const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
    `&access_type=offline` +
    `&prompt=consent`;
    console.log(oauthUrl,"oauthurllll")
    return oauthUrl
}




export async function googleAuthCallback(
    code:string
): Promise<{accessToken:string,refreshToken:string}> {

    if (!code) {
        throw new Error( 'Authorization code not provided.' );
    }
try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI, 
                grant_type: 'authorization_code',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
             const oauth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI // This is still needed for the OAuth2 client setup, even if not directly used for sending.
        );
        oauth2Client.setCredentials({
            access_token: access_token,
            refresh_token: refresh_token,
        });
                const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const rawMessage = [
            `From: ${"jasirbinbasheerpp@gmail.com"}`,
            `To: ${"jasirbasheerpp@gmail.com"}`,
            `Subject: ${"subject"}`,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset="UTF-8"',
            'Content-Transfer-Encoding: 7bit',
            '', 
            "connected successfully",
        ].join('\n');

        const encodedMessage = base64url.encode(rawMessage);

        const response = await gmail.users.messages.send({
            userId: 'me', 
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('Email sent:', response.data);


        
        return {accessToken:access_token, refreshToken:refresh_token}
    } catch (error) {
        console.log(error)
    }
    

}
