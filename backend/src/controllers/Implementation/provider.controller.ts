import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";
import { IProviderController } from "../Interface/IProviderController";
import { IProviderService } from "../../services/Interface/IProviderService";
import { createInstagramOAuthURL } from "../../provider.strategies/instagram.strategy";
import { FACEBOOK, INSTAGRAM } from "../../shared/utils/constants";
import { IClientService } from "../../services/Interface/IClientService";
import { IAgencyService } from "../../services/Interface/IAgencyService";
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
export default class ProviderController implements IProviderController {
    private providerService: IProviderService;
    private clientService: IClientService;
    private agencyService: IAgencyService

    constructor(
        @inject('ProviderService') providerService: IProviderService,
        @inject('ClientService') clientService: IClientService,
        @inject('AgencyService') agencyService: IAgencyService,

    ) {
        this.providerService = providerService
        this.clientService = clientService
        this.agencyService = agencyService

    }

    async processContentApproval(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contentId, clientId } = req.params
            const content: any = await this.providerService.getContentById(req.details.orgId, contentId)

            if (!content) throw new Error('content does not exists')
            const response = await this.providerService.handleSocialMediaUploads(req.details.orgId, content, clientId, false)

            if (response) {
                console.log(response)
                await this.providerService.updateContentStatus(req.details.orgId, contentId, "Approved")
            }
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error) {
            next(error)
        }
    }

    async getMetaPagesDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { access_token } = req.params
            const pages = await this.providerService.getMetaPagesDetails(access_token as string)
            console.log("pages", pages)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { pages })
        } catch (error) {
            next(error)
        }
    }

    async connectSocialPlatforms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { provider } = req.params
            const redirectUri: string = req.query.redirectUri as string;
            console.log(redirectUri)
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



    async saveSocialPlatformToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { platform, provider, user_id } = req.params
            const { token } = req.body

            console.log(platform, provider, user_id, token)

            if (user_id) {
                switch (platform) {
                    case 'agency':
                        console.log('reached hereee', "platform", platform, "provider", provider, "user_id", user_id, "token", token)
                        await this.agencyService.saveAgencySocialMediaTokens(req.details.orgId, provider, token)
                        break;
                    case 'client':
                        await this.clientService.saveClientSocialMediaTokens(req.details.orgId, user_id, provider, token)
                        break;
                    case 'influencer':
                        // await this.clientService.saveClientSocialMediaTokens(req.details.orgId, user_id, provider, token)
                        break;
                    default:
                        break;
                }
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

            if (clientId) {
                await this.clientService.setSocialMediaUserNames(req.details.orgId, clientId, provider, username)
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
            const reviewBucket = await this.clientService.getReviewBucket(req.details.orgId, clientId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { reviewBucket })

        } catch (error) {
            next(error)
        }
    }


}

