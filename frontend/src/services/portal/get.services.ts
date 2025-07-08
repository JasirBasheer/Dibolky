import api from "@/utils/axios";

export const fetchTrialPlans = async() => {
    return await api.get('/api/public/trial-plans')
}

