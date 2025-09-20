import { inject, injectable } from "tsyringe";
import { IPortfolioRepository, ITestimonialRepository } from "@/repositories";
import { CustomError } from "mern.common";
import { IPortfolioService } from "../Interface";
import { IPortfolio, IPortfolioType, ITestimonialType } from "@/models";
import { PortfolioMapper } from "@/mappers/agency/portfolio-mapper";

@injectable()
export class PortfolioService implements IPortfolioService {
  private _portfolioRepository: IPortfolioRepository;
  private _testimonialRepository: ITestimonialRepository;

  constructor(
    @inject("PortfolioRepository") portfolioRepository: IPortfolioRepository,
    @inject("TestimonialRepository") testimonialRepository: ITestimonialRepository
  ) {
    this._portfolioRepository = portfolioRepository;
    this._testimonialRepository = testimonialRepository;
  }

  async createPortfolio(orgId: string, details: Partial<IPortfolioType>): Promise<void> {
    try {
      let newPortfolio = await this._portfolioRepository.createPortfolio(
        orgId,
        details
      );
      if (!newPortfolio) throw new CustomError("Error while create new chat", 500);
    } catch (error) {
      throw new CustomError("Error while creating chat", 500);
    }
  }

  async editPortfolio(orgId: string, details: Partial<IPortfolioType>): Promise<void> {
    try {
      let updatedPortfolio = await this._portfolioRepository.editPortfolio(
        orgId,
        details
      );
      if (!updatedPortfolio) throw new CustomError("Error while create new chat", 500);
    } catch (error) {
      throw new CustomError("Error while creating chat", 500);
    }
  }

  async getPortfolios(orgId: string, type:string): Promise<IPortfolioType[]>{
    const portfolios = await this._portfolioRepository.getPortfolios(orgId,type) ?? []
    return PortfolioMapper.PortfolioDetailsMapper(portfolios)
  }

  async getAllTestimonials(orgId: string): Promise<ITestimonialType[]>{
    const testimonials = await this._testimonialRepository.getAllTestimonials(orgId)
    return PortfolioMapper.TestimonialsDetailsMapper(testimonials)
  }

  async createTestimonail(orgId: string, details: Partial<ITestimonialType>): Promise<void>{
    const createdTestimonial = await this._testimonialRepository.createTestimonial(orgId,details)
    if (!createdTestimonial) throw new CustomError("Error while new testimonial", 500);
  }
}
