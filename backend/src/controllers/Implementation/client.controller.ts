import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "../../services/Interface/IClientService";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";

@injectable()
export default class ClientController implements IClientController {
    private _clientService: IClientService;

    constructor(
        @inject('ClientService') clientService: IClientService
    ) {
        this._clientService = clientService
    }

    getClient = async(
        req: Request, 
        res: Response, 
    ): Promise<void> => {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const details = await this._clientService.verifyClient(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "client" })
    }

    getClientDetails = async(
        req: Request, 
        res: Response, 
    ): Promise<void> => {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const details = await this._clientService.getClientDetails(req.details.orgId as string, req.details.email as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { client: details })
    }

    getOwner = async(
        req: Request, 
        res: Response, 
    ): Promise<void> => {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const owners = await this._clientService.getOwners(req.details.orgId as string)
            if (!owners) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { owners })
    }



}

