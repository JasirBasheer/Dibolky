import { IPortfolioType, ITestimonialType } from "@/models";

export interface IPortfolioService {
  createPortfolio(orgId: string, details: Partial<IPortfolioType>): Promise<void>;
  editPortfolio(orgId: string, details: Partial<IPortfolioType>): Promise<void>;
  getPortfolios(orgId: string, type: string): Promise<IPortfolioType[]>;
  getAllTestimonials(orgId: string): Promise<ITestimonialType[]>;
  createTestimonail(orgId: string, details:Partial<ITestimonialType>): Promise<void>;

}
