import api from "@/utils/axios";

export const createPlanApi = async(details:object) =>{
    return await api.post('/api/admin/plans', {details})
}

export const changePlanStatusApi = async(plan_id:string) =>{
    return await api.patch(`/api/admin/plans/${plan_id}`)
}
export const updatePlanApi = async(plan_id:string, details: object) =>{
    console.log(details,"detailsss")
    return await api.put(`/api/admin/plans/${plan_id}`,details)
}







