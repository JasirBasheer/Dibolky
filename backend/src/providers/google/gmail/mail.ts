import { env } from "@/config";
import { isErrorWithMessage } from "@/validators";
import base64url from "base64url";
import { google } from "googleapis";

export async function sendGMail(
  accessToken: string,
  refreshToken: string,
  from: string,
  to: string[],
  subject: string,
  message: string
): Promise<void> {
  if (!accessToken || !refreshToken || !from || !to || !message) {
    throw new Error("Required parameters missing.");
  }

  console.log("To emails:", to);
  const validBcc = to.filter(email => typeof email === "string" && email.includes("@"));
  console.log("Valid Bcc emails:", validBcc);

  if (!validBcc.length) {
    throw new Error("No valid Bcc emails provided.");
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE.MAIL.CLIENT_ID,
      env.GOOGLE.MAIL.CLIENT_SECRET,
      env.GOOGLE.MAIL.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const rawMessage = [
      `From: ${from}`,
      `To: ${from}`, 
      `Bcc: ${validBcc.join(", ")}`,
      `Subject: ${subject || "No Subject"}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 7bit",
      "",
      message,
    ].join("\n");

    const encodedMessage = base64url.encode(rawMessage);

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Email sent successfully to", validBcc.length, "recipients");
  } catch (error: unknown) {
    const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error";
    console.error("Gmail API Error:", error);
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}