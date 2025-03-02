import { NextFunction, Request, Response } from "express";
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


    async getAgency(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const details = await this.agencyService.verifyOwner(req.details._id as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "agency" })
        } catch (error: unknown) {
            next(error);
        }
    }


    async getAgencyOwnerDetails(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const details = await this.agencyService.getAgencyOwnerDetails(req.details.orgId as string)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
        } catch (error: unknown) {
            next(error);
        }
    }



    async createClient(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")

            const { orgId, name, email, industry, services, menu } = req.body
            const isClientExists = await this.clientService.getClientInMainDb(email)
            if (isClientExists) throw new ConflictError("Client with this email is already exists in the main database")
            await this.agencyService.createClient(orgId, name, email, industry, services, menu, req.details.organizationName as string)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error: unknown) {
            next(error);
        }
    }





    async getAllClients(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")

            const orgId = req.details.orgId as string
            const clients = await this.agencyService.getAllClients(orgId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })

        } catch (error: unknown) {
            next(error);
        }
    }


    async getClient(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const { id } = req.params            
            const details = await this.agencyService.getClient(req.details.orgId as string, id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
        } catch (error: unknown) {
            next(error);
        }
    }

    async uploadContent(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { selectedContentType, selectedPlatforms, id, files, caption } = req.body;
            if(!req.details)throw new NotFoundError("Details Not Fount")
            if (!files) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const result = await this.agencyService.saveContentToDb(id, req.details.orgId as string, files, JSON.parse(selectedPlatforms), selectedContentType, caption)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
        } catch (error: unknown) {
            next(error);
        }
    }


    async getAvailableUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const users = await this.agencyService.getAllAvailableClients(req.details.orgId as string)
            if (!users) throw new CustomError('Error while fetch available users', 500)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users })
        } catch (error: unknown) {
            next(error);
        }
    }


    async getProjectsCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const projects = await this.agencyService.getProjectsCount(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { projects })
        } catch (error: unknown) {
            next(error);
        }
    }

    async getClientsCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const clients = await this.agencyService.getClientsCount(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })
        } catch (error: unknown) {
            next(error);
        }
    }

    async editProjectStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const { projectId, status } = req.body
            const result = await this.agencyService.editProjectStatus(req.details.orgId as string, projectId, status)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error: unknown) {
            next(error);
        }
    }

    async getInitialSetUp(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.details)throw new NotFoundError("Details Not Fount")
            const initialSetUp = await this.agencyService.getInitialSetUp(req.details.orgId as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { initialSetUp })
        } catch (error: unknown) {
            next(error);
        }
    }
}

