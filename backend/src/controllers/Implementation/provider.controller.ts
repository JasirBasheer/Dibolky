import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";
import { IProviderController } from "../Interface/IProviderController";
import { IProviderService } from "../../services/Interface/IProviderService";
import { createInstagramOAuthURL } from "../../provider.strategies/instagram.strategy";
import { createFacebookOAuthURL } from "../../provider.strategies/facebook.strategy";
import { FACEBOOK, INSTAGRAM } from "../../shared/utils/constants";
import { ReviewBucketSchema } from "../../models/agency/reviewBucketModel";
import { IClientService } from "../../services/Interface/IClientService";


declare global {
    namespace Express {
        interface Request {
            files?: any,
            formData: any
        }
    }
}



@injectable()
export default class ProviderController implements IProviderController {
    private providerService: IProviderService;
    private clientService: IClientService;

    constructor(
        @inject('ProviderService') providerService: IProviderService,
        @inject('ClientService') clientService: IClientService,

    ) {
        this.providerService = providerService
        this.clientService = clientService

    }

    async processContentApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contentId, clientId } = req.params
            const db = await req.tenantDb.model('reviewBucket', ReviewBucketSchema)
            const content = await this.providerService.getContentById(contentId, db)

            if (!content) throw new Error('content does not exists')
            const response = await this.providerService.handleSocialMediaUploads(req.tenantDb, content, clientId, false)

            if (response) {
                console.log(response)
                await this.providerService.updateContentStatus(req.tenantDb, contentId, "Approved")
            }
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error) {
            next(error)
        }
    }

    async connectSocialPlatforms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { provider } = req.params
            const redirectUri: string = req.query.redirectUri as string;
            let url;
            if (provider == INSTAGRAM) {
                url = await createInstagramOAuthURL(redirectUri);
            } else if (provider == FACEBOOK) {
                url = await createFacebookOAuthURL(redirectUri)
            }
            res.send({ url: url });

        } catch (error) {
            next(error)
        }
    }



    async saveSocialPlatformTokenToDb(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { provider, clientId } = req.params
            const { token } = req.body

            console.log(provider, clientId, token)

            if (clientId ) {
                 await this.clientService.saveClientSocialMediaTokens(clientId, provider, token, req.tenantDb)
            } 
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)



        } catch (error) {
            console.error('Error saving social platform token:', error)
            next(error)
        }
    }


    async savePlatformUserNameToDb(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { provider, clientId } = req.params
            const { username } = req.body

            console.log(provider, clientId, username)

            if (clientId ) {
                 await this.clientService.setSocialMediaUserNames(clientId, provider, username, req.tenantDb)
            } 
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)



        } catch (error) {
            console.error('Error saving social platform token:', error)
            next(error)
        }
    }
    
    async getReviewBucket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { clientId } = req.params
            const reviewBucket = await this.clientService.getReviewBucket(clientId, req.tenantDb)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { reviewBucket })

        } catch (error) {
            next(error)
        }
    }


}

