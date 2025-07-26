import api from "@/utils/axios";

export const fetchProjectsCountApi = async() => {
    return await api.get('/api/agency/projects')
}


export const fetchInitialSetUpApi = async() =>{
    return await api.get('/api/agency/get-initial-set-up')
}

export const fetchAllClientsApi = async(query: string = '' ) =>{
    return await api.get(`/api/agency/clients${query}`)
}

export const getAllUpgradablePlansApi = async() =>{
    return await api.get(`/api/agency/plans`)
}


export const fetchAgencyMenuApi = async(role:string,planId:string) =>{
    return await api.get(`/api/entities/${role}/${planId}`)
}

export const fetchAgencyOwnerDetailsApi = async() =>{
    return await  api.get(`/api/agency/owner-details`)
}

export const fetchClientApi = async(client_id :string) =>{
    return await api.get(`/api/agency/clients/${client_id}`)
}

export const fetchAvailableUsersApi = async() =>{
    return await api.get("/api/agency/users")
}

export const getPaymentIntegrationsStatus = async () => {
    return await api.get(`/api/agency/get-payment-integration-status`)
  }
