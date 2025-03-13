import api from "@/utils/axios";

export const createPlanApi = async(details:object) =>{
    return await api.post('/api/admin/create-plan', {details})
}

export const changePlanStatusApi = async(entity:string,plan_id:string) =>{
    return await api.post('/api/admin/change-plan-status',{entity,plan_id})
}



