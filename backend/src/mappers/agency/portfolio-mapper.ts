import {
  IPortfolio,
  IPortfolioType,
  ITestimonial,
  ITestimonialType,
} from "@/models";

export class PortfolioMapper {
  static PortfolioDetailsMapper(details: IPortfolio[]): IPortfolioType[] {
    return details.map((portfolio: IPortfolio): IPortfolioType => {
      return {
        _id: portfolio._id.toString(),
        title: portfolio.title,
        description: portfolio.description,
        media: portfolio.media.map((m) => ({
          type: m.type,
          url: m.url,
          key: m.key,
        })),
        tags: portfolio.tags,
        type: portfolio.type,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
      };
    });
  }

 static TestimonialsDetailsMapper(
    details: ITestimonial[]
  ): ITestimonialType[] {
    return details.map((portfolio: ITestimonial): ITestimonialType => {
      return {
        _id: portfolio._id.toString(),
        clientName: portfolio.clientName,
        companyLogo: portfolio.companyLogo,
        testimonialText: portfolio.testimonialText,
        rating: portfolio.rating,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
      };
    });
  }
}
