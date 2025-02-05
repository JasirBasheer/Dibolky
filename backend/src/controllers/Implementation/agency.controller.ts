import { NextFunction, Request, Response } from "express";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { ConflictError, HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";
import { createInstagramOAuthURL } from "../../provider.strategies/instagram.strategy";
import { IClientService } from "../../services/Interface/IClientService";
import { uploadToS3 } from "../../shared/utils/aws";
import { AWS_S3_BUCKET_NAME } from "../../config/env";
import { FACEBOOK, INSTAGRAM } from "../../shared/utils/constants";
import { createFacebookOAuthURL } from "../../provider.strategies/facebook.strategy";


declare global {
    namespace Express {
        interface Request {
            files?: any,
            formData: any
        }
    }
}



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


    async getAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const details = await this.agencyService.verifyOwner(req.details._id)
            if (!details) throw new NotFoundError("Account Not found")
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details, role: "Agency" })
        } catch (error: any) {
            next(error)
        }
    }



    async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { orgId, name, email, industry, socialMedia_credentials, services, menu } = req.body
            const isClientExists = await this.clientService.getClientInMainDb(email)
            console.log(isClientExists,"clientDetails");
            if(isClientExists)throw new ConflictError("Client with this email is already exists in the main database")
            await this.agencyService.createClient(req.tenantDb, orgId, name, email, industry, socialMedia_credentials, services, menu)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error: any) {
            next(error)
        }
    }

   
    


    async getAllClients(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgId = req.details.orgId
            console.log('orgId', orgId)
            const clients = await this.agencyService.getAllClients(orgId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })

        } catch (error) {
            console.log(error)

        }
    }


    async getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgId = req.details.orgId
            const { id } = req.params
            console.log('orgId', orgId)
            const client = await this.agencyService.getClient(req.tenantDb, id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { client })

        } catch (error) {
            console.log(error)

        }
    }

    async uploadContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = req.files;
            const { selectedContentType, selectedPlatforms, id, caption } = req.body;


            if (!files) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const result = await this.agencyService.saveContentToDb(id, req.details.orgId, req.tenantDb, files, JSON.parse(selectedPlatforms), selectedContentType, caption)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);


        } catch (error) {
            next(error)

        }
    }


}

