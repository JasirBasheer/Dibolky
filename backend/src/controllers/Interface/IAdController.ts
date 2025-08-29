import { Request, Response } from "express";

export interface IAdController {
  getCampaigns(req: Request, res: Response): Promise<void>;
  createCampaign(req: Request, res: Response): Promise<void>;
  getAdSets(req: Request, res: Response): Promise<void>;
  createAdSet(req: Request, res: Response): Promise<void>;
  getAllAds(req: Request, res: Response): Promise<void>;
  createAd(req: Request, res: Response): Promise<void>;
}
