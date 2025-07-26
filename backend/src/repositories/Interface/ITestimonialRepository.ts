import { IBaseRepository } from "mern.common";
import { ITestimonial } from "@/models/Interface/testimonial";

export interface ITestimonialRepository extends IBaseRepository<ITestimonial> {
  createTestimonial(orgid: string, details: Partial<ITestimonial>): Promise<ITestimonial>;
  getAllTestimonials(orgId: string): Promise<ITestimonial[]>;
}
