import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { 
    HTTPStatusCodes, 
    ResponseMessage, 
    SendResponse 
} from 'mern.common';
import { IPlanController } from '../Interface/IPlanController';
import { IPlanService } from '@/services/Interface/IPlanService';
import { IPlanType } from '@/types';
import { PlanDetailsDTO } from '@/dto';

@injectable()
export default class PlanController implements IPlanController {
    private _planService: IPlanService;

    constructor(
        @inject('PlanService') _planService: IPlanService,
    ) {
        this._planService = _planService
    }

    getPlanWithConsumers = async (
        req: Request<{ plan_id: string }>,
        res: Response,
    ): Promise<void> => {
            const { plan_id } = req.params
            const details = await this._planService.getPlanDetails(plan_id)
            SendResponse(res,HTTPStatusCodes.OK,ResponseMessage.SUCCESS,{details})
    }

    getPlans = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
        const plans = await this._planService.getPlans()
        SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,{plans})
    }

    getPlansWithPricing = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const plans = await this._planService.getAllPlans(req.cookies?.userCountry)
            if (plans) return SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plans })
            SendResponse(res, HTTPStatusCodes.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
    }

    getAllTrialPlans = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const trialPlans = await this._planService.getAllTrailPlans()
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { trialPlans })
    }

    getPlanWithPricing = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { plan_id } = req.params
            const plan = await this._planService.getPlan(plan_id,req.cookies.userCountry);
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plan })
    }

    createPlan = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { details }: { details: PlanDetailsDTO } = req.body
            await this._planService.createPlan(details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

    editPlan = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { details }: {details: IPlanType } = req.body
            await this._planService.editPlan(details)

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

    changePlanStatus = async (
        req: Request<{ plan_id: string }>,
        res: Response,
    ): Promise<void> => {
            const { plan_id } = req.params
            await this._planService.changePlanStatus(plan_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }



}
