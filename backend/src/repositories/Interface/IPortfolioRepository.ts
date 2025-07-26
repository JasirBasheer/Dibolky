import { IBaseRepository } from "mern.common";
import { IPortfolio, IPortfolioType } from "@/models";

export interface IPortfolioRepository extends IBaseRepository<IPortfolio> {
  createPortfolio(orgid: string, details: Partial<IPortfolioType>): Promise<IPortfolio>;
  editPortfolio(orgid: string, details: Partial<IPortfolioType>): Promise<IPortfolio>;
  getPortfolios(orgid: string, type: string): Promise<IPortfolio[]>;
}
