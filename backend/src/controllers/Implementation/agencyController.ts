import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../shared/utils/CustomError";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";

@injectable()
export default class AgencyController implements IAgencyController {
    private agencyService: IAgencyService;

    constructor(
        @inject('IAgencyService') agencyService : IAgencyService
    ) {
        this.agencyService = agencyService
    }


    async getAgency(req:Request,res:Response, next:NextFunction):Promise<any>{
        try {
            const details = await this.agencyService.verifyOwner(req.details.email)
            if(!details)throw new CustomError('Account not found',404)
            return res.status(200).json({success:true,details,role:"Agency"})
        } catch (error:any) {
          next(error)
        }
    }



    async createClient(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { orgId, name, email,industry, socialMedia_credentials } = req.body

            //validate the client datas --later
            await this.agencyService.createClient(req.clientModel ,orgId, name, email,industry, socialMedia_credentials)
            return res.status(201).json({ success: true })
        } catch (error:any) {
            next(error)
        }
    }



   
}

