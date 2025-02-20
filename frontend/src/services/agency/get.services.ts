import api from "@/utils/axios";

export const fetchProjectsCountApi = () => {
    return api.get('/api/agency/projects-count')
}

export const fetchClientsCountApi = () =>{
    return api.get('/api/agency/clients-count')
}