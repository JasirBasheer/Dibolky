import { NextFunction, Request, Response } from "express";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";

@injectable()
export default class AgencyController implements IAgencyController {
    private agencyService: IAgencyService;

    constructor(
        @inject('AgencyService') agencyService : IAgencyService
    ) {
        this.agencyService = agencyService
    }


    async getAgency(req:Request,res:Response, next:NextFunction):Promise<void>{
        try {
            const details = await this.agencyService.verifyOwner(req.details.email)
            if(!details)throw new NotFoundError("Account Not found")
            SendResponse(res,HTTPStatusCodes.OK,ResponseMessage.SUCCESS,{details,role:"Agency"})
        } catch (error:any) {
          next(error)
        }
    }



    async createClient(req: Request, res: Response, next:NextFunction): Promise<void> {
        try {
            const { orgId, name, email,industry, socialMedia_credentials } = req.body

            //validate the client datas --later
            await this.agencyService.createClient(req.clientModel ,orgId, name, email,industry, socialMedia_credentials)
            SendResponse(res,HTTPStatusCodes.CREATED,ResponseMessage.CREATED)
        } catch (error:any) {
            next(error)
        }
    }



   
}

