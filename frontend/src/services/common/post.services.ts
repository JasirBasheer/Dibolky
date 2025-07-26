import { IContentData, IFilesMetaData, INote, IUpdateProfile } from "@/types/common";
import api from "@/utils/axios";

export const savePlatformTokenApi = async (
    platform: string,
    provider: string,
    user_id: string,
    tokens: {accessToken:string,refreshToken?:string}
) => {
    console.log(tokens,'tokens fomrdlfksjlfslkjfksj')
    return await api.post(
        `/api/entities/save-platform-token/${platform}/${provider}/${user_id}`,
        { accessToken:tokens.accessToken,refreshToken:tokens.refreshToken || "" }
    );
}


export const checkIsMailExistsApi = async (
    mail:string,
) => {
    return await api.post('/api/public/check-mail', {
        mail
    });
}

export const InitiateS3BatchUpload = async (
    filesMetadata: IFilesMetaData[]
) => {
    return await api.post('/api/entities/initiate-s3-batch-upload', {
        files: filesMetadata
    });
}


export const saveContentApi = async (
    platform: string,
    user_id: string,
    contentData: IContentData
) => {
    return await api.post(`/api/entities/content/save/${platform}/${user_id}`,
        contentData
    );
}



export const updateProfileApi = async (
    role: string,
    details: IUpdateProfile,
) => {
    console.log(details, role)
    return await api.post(`/api/entities/update-profile`, { role, details });
}


export const getUploadUrlApi = async (
    file: object
) => {
    return await api.post(`/api/entities/get-s3Upload-url`, { file });
}


export const getSignedUrlApi = async (
    key: string
) => {
    return await api.post(`/api/entities/get-signedUrl`, { key });
}


export const approveContentApi = async (
    content_id: string,
    platform: string,
    user_id: string
) => {
    return await api.post(`/api/entities/approve-content`, { content_id, platform, user_id })
}

export const rejectContentApi = async (
    content_id:string,
    reason: Partial<INote>
) => {
    return await api.post(`/api/entities/reject-content`, { content_id, reason })
}


export const fetchChatsApi = async (
    chatId: string,
) => {
    return await api.post(`/api/entities/chats`, { chatId })
}

export const handleLinkedinAndXCallbackApi = async (
    code: string,
    provider: string,
    state?: string,
) => {
    console.log('calling api')
    return await api.post(`/api/entities/${provider}/callback`, { code,state })
}


export const getInboxConversations = async (
    role: string,
    user_id: string,
    selectedPlatforms: string[],
    selectedPages: string[]
) => {
    console.log(user_id,"dsaf")
    return await api.post(`/api/entities/inbox/${role}/${user_id}`, { selectedPages, selectedPlatforms })
}


export const getMediaApi = async (
    role: string,
    user_id: string,
    selectedPlatforms: string[],
    selectedPages: string[]
) => {
    return await api.post(`/api/entities/media/${role}/${user_id}`, { selectedPages, selectedPlatforms })
}

export const getMediaDetailsApi = async (
    role: string,
    user_id: string,
    media: {platform:string, id:string,type:string, pageId:string},
) => {
    return await api.get(`/api/entities/media/${role}/${user_id}/${media.platform}/${media.pageId}/${media.id}/${media.type}`,)
}




export const replayCommentApi = async (
    entity:string,  user_id: string,
    platform:string, commentId:string, replyMessage:string,pageId:string
) => {
    return await api.post(`/api/entities/media/comments`,{
        entity,user_id,platform,commentId,replyMessage, pageId
    })
}