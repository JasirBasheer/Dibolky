import { Request, Response } from "express";
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

    getInfluencer = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const details = await this.influencerService.verifyInfluencer(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "influencer" })
    }

}

