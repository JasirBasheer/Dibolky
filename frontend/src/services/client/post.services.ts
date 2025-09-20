import api from "@/utils/axios";

export const createTestimonailsApi = async (
    details: object,
) => {
    return await api.post(`/api/showcase/testimonials`, { details })
}
