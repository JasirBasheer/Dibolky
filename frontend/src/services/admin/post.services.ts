import api from "@/utils/axios";

export const createPlanApi = async(details:object) =>{
    return await api.post('/api/admin/plans', {details})
}

export const changePlanStatusApi = async(plan_id:string) =>{
    return await api.patch(`/api/admin/plans/${plan_id}`)
}



