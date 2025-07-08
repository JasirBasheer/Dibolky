import api from "@/utils/axios";

export const getPlanDetailsApi = async(planId:string) =>{
    return await api.get(`/api/admin/plans/${planId}`);
}
