import api from "@/utils/axios";


export const getClientDetailsApi = async() =>{
    return await api.get(`/api/client/details`);
}
