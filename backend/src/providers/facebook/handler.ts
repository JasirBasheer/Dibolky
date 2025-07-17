import { IBucket } from "@/types"
import { CONTENT_TYPE } from "@/utils"
import { 
    uploadFacebookPost, 
    uploadFacebookReel, 
    uploadFaceBookStory, 
    uploadFaceBookThought, 
    uploadFaceBookVideo 
} from "@/media-service"

export async function handleFacebookUpload(
    content: IBucket, 
    access_token: string
): Promise<{name:string,status: string,id:string } > {
    switch (content.contentType) {
        case CONTENT_TYPE.POST:
            return await uploadFacebookPost(access_token, content)
        case CONTENT_TYPE.REEL:
            return await uploadFacebookReel(access_token, content)
        case CONTENT_TYPE.VIDEO:
            return await uploadFaceBookVideo(access_token, content)
        case CONTENT_TYPE.STORY:
            return await uploadFaceBookStory(access_token, content)
        case CONTENT_TYPE.THOUGHT:
            return await uploadFaceBookThought(access_token, content)
        default:
            throw new Error(`Unsupported content type`);
    }
}