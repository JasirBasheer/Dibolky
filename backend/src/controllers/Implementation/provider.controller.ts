import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";
import { IProviderController } from "../Interface/IProviderController";
import { IProviderService } from "../../services/Interface/IProviderService";
import { createInstagramOAuthURL } from "../../provider.strategies/instagram.strategy";
import { createFacebookOAuthURL } from "../../provider.strategies/facebook.strategy";
import { FACEBOOK, INSTAGRAM } from "../../shared/utils/constants";


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

    constructor(
        @inject('ProviderService') providerService: IProviderService,

    ) {
        this.providerService = providerService
    }

    async approveContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { contentId, clientId } = req.params
            const response = await this.providerService.handleSocialMediaUploads(req.tenantDb,contentId,clientId)

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
                const {provider} = req.params
                const redirectUri: string = req.query.redirectUri as string;
                let url;
                if(provider == INSTAGRAM){
                url = await createInstagramOAuthURL(redirectUri);
                }else if(provider == FACEBOOK){
                url = await createFacebookOAuthURL(redirectUri)
                }
                res.send({ url:url });
    
            } catch (error) {
                next(error)
            }
        }


}

