import api from "@/utils/axios";


export const createAgencyApi = async (
    details: object,
    transaction_id?: string
) => {
    return await api.post(
        `/api/entities/create-agency`,
        {
            details,
            transaction_id
        }
    );
}

export const createInfluencerApi = async (
    details: object,
    transaction_id?: string
) => {
    return await api.post(
        `/api/entities/create-influencer`,
        {
            details,
            transaction_id
        }
    );
}