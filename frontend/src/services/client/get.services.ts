import api from "@/utils/axios";

export const rejectContentApi = async(content_id:string) => {
    return await api.get(`/api/client/reject-content/${content_id}`)
}