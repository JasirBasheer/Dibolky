import api from "@/utils/axios";

export const fetchProjectsCountApi = () => {
    return api.get('/api/agency/projects-count')
}

export const fetchClientsCountApi = () =>{
    return api.get('/api/agency/clients-count')
}

export const fetchInitialSetUpApi = () =>{
    return api.get('/api/agency/get-initial-set-up')
}

export const fetchAllClientsApi = () =>{
    return api.get('/api/agency/clients')
}

export const fetchAgencyMenuApi = (role:string,planId:string) =>{
    return api.get(`/api/entities/${role}/${planId}`)
}

export const fetchAgencyOwnerDetailsApi = async() =>{
    return await  api.get(`/api/agency/owner-details`)
}

export const fetchClientApi = async(client_id :string) =>{
    return await api.get(`/api/agency/client/${client_id}`)
}