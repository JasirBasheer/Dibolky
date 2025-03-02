import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "../../services/Interface/IClientService";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";

@injectable()
export default class ClientController implements IClientController {
    private clientService: IClientService;

    constructor(
        @inject('ClientService') clientService: IClientService
    ) {
        this.clientService = clientService
    }

    async getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const details = await this.clientService.verifyClient(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "Client" })
        } catch (error: unknown) {
            next(error);
        }
    }

    async getClientDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const details = await this.clientService.getClientDetails(req.details.orgId as string, req.details.email as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { client: details })

        } catch (error: unknown) {
            next(error);
        }
    }

    async getOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const owners = await this.clientService.getOwners(req.details.orgId as string)
            if (!owners) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { owners })

        } catch (error: unknown) {
            next(error);
        }
    }



}

