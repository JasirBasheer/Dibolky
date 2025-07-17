import { Request, Response } from "express";

export interface IPlanController {
  getPlanWithConsumers(req: Request, res: Response): Promise<void>;
  getPlans(req: Request, res: Response): Promise<void>;
  getPlanWithPricing(req: Request, res: Response): Promise<void>;
  getPlansWithPricing(req: Request, res: Response): Promise<void>;
  getAllTrialPlans(req: Request, res: Response): Promise<void>;

  createPlan(req: Request, res: Response): Promise<void>;
  editPlan(req: Request, res: Response): Promise<void>;
  changePlanStatus(req: Request, res: Response): Promise<void>;
}
