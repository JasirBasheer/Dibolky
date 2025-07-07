import { Request, Response } from "express";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { IClientService } from "../../services/Interface/IClientService";
import {
    ConflictError,
    CustomError,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from "mern.common";




@injectable()
export default class AgencyController implements IAgencyController {
    private agencyService: IAgencyService;
    private clientService: IClientService

    constructor(
        @inject('AgencyService') agencyService: IAgencyService,
        @inject('ClientService') clientService: IClientService

    ) {
        this.agencyService = agencyService
        this.clientService = clientService
    }


    getAgency = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const details = await this.agencyService.verifyOwner(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "agency" })
    }


    getAgencyOwnerDetails = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const details = await this.agencyService.getAgencyOwnerDetails(req.details.orgId as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
    }



    createClient = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")

            const { orgId, name, email, industry, services, menu } = req.body
            console.log(req.body,'bodyeee')
            await this.agencyService.createClient(orgId, name, email, industry, services, menu, req.details.organizationName as string)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
    }





    getAllClients = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")

            const orgId = req.details.orgId as string
            const clients = await this.agencyService.getAllClients(orgId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })

    }


    getClient = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { id } = req.params
            const details = await this.agencyService.getClient(req.details.orgId as string, id)
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

            const result = await this.agencyService.saveContentToDb(id, req.details.orgId as string, files, JSON.parse(selectedPlatforms), selectedContentType, caption)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
    }


    getAvailableUsers = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const users = await this.agencyService.getAllAvailableClients(req.details.orgId as string)
            if (!users) throw new CustomError('Error while fetch available users', 500)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users })
    }


    getProjectsCount = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const projects = await this.agencyService.getProjectsCount(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { projects })
    }

    getClientsCount = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const clients = await this.agencyService.getClientsCount(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })
    }

    editProjectStatus = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { projectId, status } = req.body
            const result = await this.agencyService.editProjectStatus(req.details.orgId as string, projectId, status)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

    getInitialSetUp = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const initialSetUp = await this.agencyService.getInitialSetUp(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { initialSetUp })
    }


    IntegratePaymentGateWay = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { details, provider } = req.body
            const gatewayDetails = await this.agencyService.integratePaymentGateWay(req.details.orgId as string, provider, details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details: gatewayDetails, provider })

    }

    getPaymentIntegrationStatus = async(
        req: Request,
    res: Response
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const paymentIntegrationStatus = await this.agencyService.getPaymentIntegrationStatus(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { paymentIntegrationStatus })
    }
}

