import { Request, Response } from "express";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import {
    ConflictError,
    CustomError,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from "mern.common";




@injectable()
export class AgencyController implements IAgencyController {
    private _agencyService: IAgencyService;

    constructor(
        @inject('AgencyService') agencyService: IAgencyService,

    ) {
        this._agencyService = agencyService
    }


    getAgency = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const details = await this._agencyService.verifyOwner(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "agency" })
    }


    getAgencyOwnerDetails = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const details = await this._agencyService.getAgencyOwnerDetails(req.details.orgId as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
    }



    createClient = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")

            const { orgId, name, email, industry, services, menu } = req.body
            await this._agencyService.createClient(orgId, name, email, industry, services, menu, req.details.organizationName as string)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
    }





    getAllClients = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const includeDetails = req.query.include === 'details';
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

            let result = await this._agencyService.getAllClients(req.details.orgId as string,{includeDetails, page, limit}) 
            console.log(result)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, {result})
    }


    getClient = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { id } = req.params
            const details = await this._agencyService.getClient(req.details.orgId as string, id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
    }

    uploadContent = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { selectedContentType, selectedPlatforms, id, files, caption } = req.body;
            if (!req.details) throw new NotFoundError("Details Not Fount")
            if (!files) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const result = await this._agencyService.saveContentToDb(id, req.details.orgId as string, files, JSON.parse(selectedPlatforms), selectedContentType, caption)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
    }


    getAvailableUsers = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const users = await this._agencyService.getAllAvailableClients(req.details.orgId as string)
            if (!users) throw new CustomError('Error while fetch available users', 500)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users })
    }


    getProjectsCount = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const projects = await this._agencyService.getProjectsCount(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { projects })
    }

    getClientsCount = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const clients = await this._agencyService.getClientsCount(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })
    }

    editProjectStatus = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { projectId, status } = req.body
            const result = await this._agencyService.editProjectStatus(req.details.orgId as string, projectId, status)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

    getInitialSetUp = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const initialSetUp = await this._agencyService.getInitialSetUp(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { initialSetUp })
    }


    IntegratePaymentGateWay = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { details, provider } = req.body
            const gatewayDetails = await this._agencyService.integratePaymentGateWay(req.details.orgId as string, provider, details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details: gatewayDetails, provider })

    }

    getPaymentIntegrationStatus = async(
        req: Request,
    res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const paymentIntegrationStatus = await this._agencyService.getPaymentIntegrationStatus(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { paymentIntegrationStatus })
    }

    createInvoice = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { details } = req.body
            const paymentIntegrationStatus = await this._agencyService.createInvoice(req.details.orgId,details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { paymentIntegrationStatus })
    }

    getAllPlans = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            
            const upgradablePlans = await this._agencyService.getUpgradablePlans(req.details.orgId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { upgradablePlans })
    }

}

