import api from "@/utils/axios";

export const getOwnerId = () => {
    return api.get('/api/entities/owner')
}

export const getAllProjects = (
    page: number
) => {
    return api.get(`/api/entities/projects/${page}`)
}

export const getConnectSocailMediaUrlApi = async(
    endpoint: string
) => {
    return await api.get(endpoint)
}   

export const getContentsApi = async(
    userId : string
) => {
    return await api.get(`/api/entities/contents/${userId}`)
}   

export const fetchMessagesApi = async(
    userId :string
) =>{
    return await api.get(`/api/entities/get-messages/${userId}`)
}

export const fetchAllChatsApi = async(
    userId :string
) =>{
    return await api.get(`/api/entities/get-chats/${userId}`)
}

export const getMetaPages = async(
    token :string
) =>{
    return await api.get(`/api/entities/get-meta-pages/${token}`)
}

export const fetchAllSchduledContentsApi = async(
    user_id :string
) =>{
    return await api.get(`/api/entities/get-scheduled-contents/${user_id}`)
}


export const fetchConnections = async (entity:string,user_id:string) => {
    return await api.get(`/api/entities/get-connections/${entity}/${user_id}`)
}


export const getPlanDetailsApi = async(planId:string) =>{
    return await api.get(`/api/public/plans/${planId}`);
}



export const getInboxMessagesApi = async (
    user_id: string,
    platform: string,
    conversationId: string
) => {
    console.log(user_id,"dsaf")
    return await api.get(`/api/entities/inboxMessages/${platform}/${user_id}/${conversationId}`)
}
