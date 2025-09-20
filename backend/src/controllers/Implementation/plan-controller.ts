import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, ResponseMessage, SendResponse } from "mern.common";
import { IPlanController } from "../Interface/IPlanController";
import { IPlanService } from "@/services/Interface/IPlanService";
import { QueryParser } from "@/utils";

@injectable()
export class PlanController implements IPlanController {
  constructor(
    @inject("PlanService")
    private readonly _planService: IPlanService
  ) {}

    getMenu = async (req: Request, res: Response): Promise<void> => {
      const { role, planId } = req.params;
      const menu = await this._planService.getMenu(req.details.orgId,role, planId);      
      SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { menu });
    };

  getPlans = async (req: Request, res: Response): Promise<void> => {
    const query = QueryParser.parseFilterQuery(req.query);
    const result = await this._planService.getPlans(query);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { result });
  };

  getAllTrialPlans = async (req: Request, res: Response): Promise<void> => {
    const result = await this._planService.getPlans({ limit: 0, page: 0, type: "trial"});
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result);
  };

  getPlan = async (req: Request, res: Response): Promise<void> => {
    const { planId } = req.params;
    const plan = await this._planService.getPlan(planId);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plan });
  };

  createPlan = async (req: Request, res: Response): Promise<void> => {
    const plan = await this._planService.createPlan(req.body);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plan });
  };

  editPlan = async (req: Request, res: Response): Promise<void> => {
    const { planId } = req.params;
    await this._planService.editPlan(planId, req.body);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  changePlanStatus = async (
    req: Request<{ planId: string }>,
    res: Response
  ): Promise<void> => {
    const { planId } = req.params;
    await this._planService.changePlanStatus(planId);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };
}
