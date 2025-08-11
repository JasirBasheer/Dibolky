import api from "@/utils/axios";

export const fetchAllClientsApi = async(query: string = '' ) =>{
    return await api.get(`/api/admin/clients${query}`)
}

export const getPlanDetailsApi = async(planId:string) =>{
    return await api.get(`/api/admin/plans/${planId}`);
}
