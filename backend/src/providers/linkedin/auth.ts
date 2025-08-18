import { env } from "@/config";
import { isErrorWithMessage } from "@/validators";
import axios from "axios";
import { AuthorizationCode } from "simple-oauth2";

export async function createLinkedInOAuthURL(
  redirectUri: string,
  state?: string
): Promise<string> {
  const SCOPE = "openid profile email w_member_social";

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=860d6lbkibt1yl&redirect_uri=${redirectUri}&scope=${encodeURIComponent(SCOPE)}&state=${state}`;
  return authUrl;
}

export async function linkedInAuthCallback(code: string, state: string): Promise<{accessToken:string}> {

  let redirect_uri = "";
  if (state === "client") {
    redirect_uri = `${env.BASE_URLS.FRONTEND}/client/integrations?provider=linkedin`;
  } else {
    redirect_uri = `${env.BASE_URLS.FRONTEND}/agency/integrations?provider=linkedin`;
  }
  
  const params = {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirect_uri,
  };

  const client = new AuthorizationCode({
    client: {
      id: "860d6lbkibt1yl",
      secret: "WPL_AP1.49hDNsCUCE92QHKR.BCD4wQ=="
    },
    auth: {
      tokenHost: "https://www.linkedin.com",
      tokenPath: "/oauth/v2/accessToken",
      authorizePath: "/oauth/v2/authorization"
    },
    options: {
      authorizationMethod: "body"
    }
  });


  try {
    const accessToken = await client.getToken(params);
    console.log(accessToken,"acess toke form linkedin")
    await new Promise((resolve) => setTimeout(resolve, 15000));
    return {accessToken: accessToken.token.access_token.toString() }
  } catch (error:unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("LinkedIn OAuth Error:", errorMessage);
    throw new Error("Failed to get access token");
  }
}

export async function getUserURN(accessToken: string): Promise<string> {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "LinkedIn-Version": "202506",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch user info: ${errorData.message}`);
  }

  const data = await response.json();
  return `urn:li:person:${data.sub}`;
}

export async function getLinkedInTokenStatus(tokens: {accessToken?:string,refreshToken?:string}): Promise<boolean> {
  try {
    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      "LinkedIn-Version": "202506",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log("Access token is valid");
      return true;
    }
    return false;
  } catch (error: unknown) {
    console.error("Error validating access token:", error);
    return false;
  }
}