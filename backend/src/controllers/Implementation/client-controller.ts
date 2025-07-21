import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IClientController } from "../Interface/IClientController";
import { IClientService } from "../../services/Interface/IClientService";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";

@injectable()
export class ClientController implements IClientController {
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

    initiateRazorpayPayment = async(
        req: Request, 
        res: Response, 
    ): Promise<void> => {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const { invoice_id } = req.params
        console.log(req.details.orgId,'orgd')
            const data = await this._clientService.initiateRazorpayPayment(req.details.orgId,invoice_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { data })
    }

    verifyInvoicePayment = async(
        req: Request, 
        res: Response, 
    ): Promise<void> => {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const { invoiceId, response } = req.body
            console.log(req.details.orgId,'orgd')
            const data = await this._clientService.verifyInvoicePayment(req.details.orgId,invoiceId,response)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { data })
    }



}

