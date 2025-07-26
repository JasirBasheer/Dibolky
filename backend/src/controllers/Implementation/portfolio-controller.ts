import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, ResponseMessage, SendResponse } from "mern.common";
import { IPortfolioService } from "@/services";
import { IPortfolioController } from "../Interface/IPortfolioController";

@injectable()
export class PortfolioController implements IPortfolioController {
  private _portfolioService: IPortfolioService;

  constructor(@inject("PortfolioService") portfolioService: IPortfolioService) {
    this._portfolioService = portfolioService;
  }

  createPortfolio = async (req: Request, res: Response): Promise<void> => {
    const { details } = req.body;
    await this._portfolioService.createPortfolio(req.details.orgId, details);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  getPortfolios = async (req: Request, res: Response): Promise<void> => {
    const { type } = req.query;
    const portfolios = await this._portfolioService.getPortfolios(req.details.orgId, type as string);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,{portfolios});
  };

  editPortfolio = async (req: Request, res: Response): Promise<void> => {
    const { details } = req.body;
    await this._portfolioService.editPortfolio(req.details.orgId, details);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

   getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
   const testimonials = await this._portfolioService.getAllTestimonials(req.details.orgId);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,{testimonials});
  };
  createTestimonial = async (req: Request, res: Response): Promise<void> => {
    const {details} = req.body
   const newTestimonial = await this._portfolioService.createTestimonail(req.details.orgId,details);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,{newTestimonial});
  };
}
