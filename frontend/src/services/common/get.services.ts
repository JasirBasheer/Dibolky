import api from "@/utils/axios";

export const getOwnerId = () =>{
    return api.get('/api/entities/owner')
}