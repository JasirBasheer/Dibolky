import { IContentData, IFilesMetaData, INote, IUpdateProfile } from "@/types/common.types";
import api from "@/utils/axios";

export const savePlatformTokenApi = async (
    platform: string,
    provider: string,
    user_id: string,
    token: string
) => {
    return await api.post(
        `/api/entities/save-platform-token/${platform}/${provider}/${user_id}`,
        { token }
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
    state: string,
    provider: string,
) => {
    return await api.post(`/api/entities/${provider}/callback`, { code,state })
}



