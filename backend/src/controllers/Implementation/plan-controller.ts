import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { 
    HTTPStatusCodes, 
    ResponseMessage, 
    SendResponse 
} from 'mern.common';
import { IPlanController } from '../Interface/IPlanController';
import { IPlanService } from '@/services/Interface/IPlanService';
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
            const result = await this._planService.getPlans({
                limit:0,
                page:0,
                type:"trial"
            })
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result)
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
            const { details } = req.body
            await this._planService.createPlan(details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

    editPlan = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { plan_id } = req.params 
            await this._planService.editPlan(plan_id, req.body)

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
