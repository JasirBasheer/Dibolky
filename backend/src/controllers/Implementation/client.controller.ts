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
            const details = await this.clientService.verifyClient(req.details._id)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "Client" })
        } catch (error: any) {
            next(error)
        }
    }

    async getClientDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const details = await this.clientService.getClientDetails(req.tenantDb, req.details.email)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { client: details })

        } catch (error: any) {
            next(error)
        }
    }

    async getOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const owners = await this.clientService.getOwners(req.tenantDb)
            if (!owners) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { owners})

        } catch (error: any) {
            next(error)
        }
    }



}

