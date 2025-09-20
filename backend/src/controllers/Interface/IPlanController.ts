import { Request, Response } from "express";

export interface IPlanController {
  getMenu(req: Request, res: Response): Promise<void>
  getPlans(req: Request, res: Response): Promise<void>;
  getPlan(req: Request, res: Response): Promise<void>;
  getAllTrialPlans(req: Request, res: Response): Promise<void>;

  createPlan(req: Request, res: Response): Promise<void>;
  editPlan(req: Request, res: Response): Promise<void>;
  changePlanStatus(req: Request, res: Response): Promise<void>;
}
