import api from "@/utils/axios";

export const authLogoutApi = async() =>{
    return await api.post('/api/auth/logout')
}