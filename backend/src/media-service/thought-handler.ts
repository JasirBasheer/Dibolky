import { IBucket } from "@/types";
import { getPages } from "./shared";
import { NotFoundError } from "mern.common";
import { publishFaceBookThought } from "@/providers/facebook";
import { publishXThought } from "@/providers/x";
import { getUserURN } from "@/providers/linkedin";
import { publishLinkedinThought } from "@/providers/linkedin/thought";

// FACEBOOK THOUGHT
export async function uploadFaceBookThought(
  accessToken: string,
  content: IBucket
): Promise<{ name: string; status: string; id: string; error?: string }> {
  if (!content.metaAccountId)throw new NotFoundError(`Meta Account ID is not found.`);
  try {
    const pages = await getPages(accessToken);
    const page = pages.data.find((item: { id: string }) => item.id === content.metaAccountId);

    if (!page) throw new NotFoundError(`Facebook Page with ID '${content.metaAccountId}' not found.`);
    await publishFaceBookThought(content, page.id, page.access_token)

    return { name: "Facebook", status: "success", id: content._id as string };
  } catch (error: any) {
    console.error(`Error posting Facebook text: ${error.message}`);
    return { name: "Facebook", status: "failed", id: content._id as string, error: `Error posting Facebook text: ${error.message}`};
  }
}


// X THOUGHT
export async function uploadXThought(
  accessToken: string,
  content: IBucket
): Promise<{ name: string; status: string; id: string; postId?: string, error?: string }> {
  if (content.caption.length > 280) return { name: "X", status: "failed", id: content._id as string };
    try {
      return await publishXThought(content,accessToken)
    } catch (error: any) {
    console.error(`Error posting Facebook text: ${error.message}`);
    return { name: "Facebook", status: "failed", id: content._id as string, error: `Error posting Facebook text: ${error.message}`};

    } 
}


// LINKEDIN THOUGHT
export async function uploadLinkedinThought(
  accessToken: string,
  content: IBucket
): Promise<{name:string, status:string, id:string ,postId?:string, error?:string}> {
  try {
    const userURN = await getUserURN(accessToken);
    return await publishLinkedinThought(content,accessToken,userURN)
  } catch (error: any) {
    return { name: "linkedin", status: "failed", id: content._id as string, error: error.message };
  }
}


