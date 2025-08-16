import api from "@/utils/axios";

export const fetchAllClientsApi = async(query: string = '' ) =>{
    return await api.get(`/api/admin/clients${query}`)
}

export const getPlanDetailsApi = async(planId:string) =>{
    return await api.get(`/api/admin/plans/${planId}`);
}

export const getAllPlans = async(query: string = '' ) =>{
    return await api.get(`/api/admin/plans${query}`)
}

export const getAllTransactions = async(query: string = '' ) =>{
    return await api.get(`/api/admin/transactions${query}`)
}