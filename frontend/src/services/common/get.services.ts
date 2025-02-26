import api from "@/utils/axios";

export const getOwnerId = () => {
    return api.get('/api/entities/owner')
}

export const getAllProjects = (pages: number, page: number) => {
    return api.get('/api/entities/projects')
}

export const getConnectSocailMediaUrlApi = async(endpoint: string) => {
    return await api.get(endpoint)
}   