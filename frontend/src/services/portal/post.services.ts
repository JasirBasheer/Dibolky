import api from "@/utils/axios";

export const createAgencyApi = async (
    details: object,
    transaction_id?: string
) => {
    return await api.post(`/api/public/agency`,{ details, transaction_id });
}
