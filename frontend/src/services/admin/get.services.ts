import api from "@/utils/axios";

export const getPlanDetailsApi = async(entity:string,planId:string) =>{
    return await api.get(`/api/admin/get-plan/${entity}/${planId}`);
}
