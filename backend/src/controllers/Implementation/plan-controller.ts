import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { 
    HTTPStatusCodes, 
    ResponseMessage, 
    SendResponse 
} from 'mern.common';
import { IPlanController } from '../Interface/IPlanController';
import { IPlanService } from '@/services/Interface/IPlanService';
import { PlanDetailsDTO } from '@/dto';
import { QueryParser } from '@/utils';

@injectable()
export class PlanController implements IPlanController {
    private _planService: IPlanService;

    constructor(
        @inject('PlanService') _planService: IPlanService,
    ) {
        this._planService = _planService
    }

    getPlans = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
        const query = QueryParser.parseFilterQuery(req.query);
        const result = await this._planService.getPlans(query)
        SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,{result})
    }


    getAllTrialPlans = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const trialPlans = await this._planService.getAllTrailPlans()
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { trialPlans })
    }

    getPlan = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { plan_id } = req.params
            const plan = await this._planService.getPlan(plan_id);
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
            console.log(req.body)
            const details: PlanDetailsDTO = req.body;
            const { plan_id } = req.params 
            await this._planService.editPlan(plan_id, details)

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
