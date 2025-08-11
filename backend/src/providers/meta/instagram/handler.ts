import { IBucket } from "../../../types/common";
import { CONTENT_TYPE } from "../../../utils/constants";
import { 
    uploadIGPost, 
    uploadIGReel, 
    uploadIGStory 
} from "@/media-service";



export async function handleInstagramUpload(
    content: IBucket, 
    access_token: string
): Promise<{ name: string, status: string, id: string }> {
    try {
        switch (content.contentType) {
            case CONTENT_TYPE.POST:
                return await uploadIGPost(content, access_token)
            case CONTENT_TYPE.VIDEO:
                return await uploadIGReel(content, access_token)
            case CONTENT_TYPE.REEL:
                return await uploadIGReel(content, access_token)
            case CONTENT_TYPE.STORY:
                return await uploadIGStory(content, access_token)
            default :
                throw new Error(`Unsupported content type`);
        }
    } catch (error) {
        throw error
    }

}
