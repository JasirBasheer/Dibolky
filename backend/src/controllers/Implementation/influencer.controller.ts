import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IInfluencerController } from "../Interface/IInfluencerController";
import { IInfluencerService } from "../../services/Interface/IInfluencerService";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";





@injectable()
export default class InfluencerController implements IInfluencerController {
    private influencerService: IInfluencerService;

    constructor(
        @inject('InfluencerService') influencerService: IInfluencerService,
    ) {
        this.influencerService = influencerService
    }

    async getInfluencer(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const details = await this.influencerService.verifyInfluencer(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
                console.log(details,'details')
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "influencer" })
        } catch (error) {
            next(error)
        }

    }

}

