import api from "@/utils/axios";

export const createTestimonailsApi = async (
    details: object,
) => {
    return await api.post(`/api/entities/testimonials`, { details })
}
