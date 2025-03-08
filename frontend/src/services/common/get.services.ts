import api from "@/utils/axios";

export const getOwnerId = () => {
    return api.get('/api/entities/owner')
}

export const getAllProjects = (page: number) => {
    return api.get(`/api/entities/projects/${page}`)
}

export const getConnectSocailMediaUrlApi = async(endpoint: string) => {
    return await api.get(endpoint)
}   

export const getContentsApi = async(userId : string) => {
    return await api.get(`/api/entities/get-review-bucket/${userId}`)
}   

export const fetchMessagesApi = async(userId :string) =>{
    return await api.get(`/api/entities/get-messages/${userId}`)
}

export const fetchAllChatsApi = async(userId :string) =>{
    return await api.get(`/api/entities/get-chats/${userId}`)
}

export const getMetaPages = async(token :string) =>{
    return await api.get(`/api/entities/get-meta-pages/${token}`)
}
