import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";
import { IProviderController } from "../Interface/IProviderController";
import { IProviderService } from "../../services/Interface/IProviderService";
import { createInstagramOAuthURL } from "@/providers/instagram";
import { IClientService } from "../../services/Interface/IClientService";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { IBucket } from "../../types/common";
import { FACEBOOK, INSTAGRAM, LINKEDIN, X } from "../../utils/constants";
import { createLinkedInOAuthURL } from "@/providers/linkedin";
import { createXAuthURL } from "@/providers/x";
import { createFacebookOAuthURL } from "@/providers/facebook";





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

    processContentApproval = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { content_id, user_id, platform } = req.body
            const content: IBucket | null = await this.providerService.getContentById(req.details.orgId as string, content_id)
            let user;
            if (platform == 'agency') {
                user = await this.agencyService.getAgencyOwnerDetails(req.details.orgId as string)
            } else {
                user = await this.agencyService.getAgencyOwnerDetails(req.details.orgId as string)
            }
            if (!content) throw new Error('content does not exists')

            const response = await this.providerService.handleSocialMediaUploads(content, user, false)

            if (response) {
                await this.providerService.updateContentStatus(req.details.orgId as string, content_id, "Approved")
            }
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

    getMetaPagesDetails = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            const { access_token } = req.params

            const pages = await this.providerService.getMetaPagesDetails(access_token as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { pages })
    }

    connectSocialPlatforms = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            const { provider } = req.params
            const redirectUri: string = req.query.redirectUri as string;
            console.log(X, provider)
            let url;

            if (provider == INSTAGRAM) {
                url = await createInstagramOAuthURL(redirectUri);
            } else if (provider == FACEBOOK) {
                url = await createFacebookOAuthURL(redirectUri)
            }else if(provider == LINKEDIN){
                url = await createLinkedInOAuthURL(redirectUri)
            }else if (provider == X){
                url = await createXAuthURL(redirectUri)
            }

            res.send({ url: url });
    }



    saveSocialPlatformToken = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { platform, provider, user_id } = req.params
            const { token } = req.body

            await this.providerService.saveSocialMediaToken(req.details.orgId as string, platform, user_id, provider, token)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }


    reScheduleContent = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { content_id, date } = req.body
            await this.providerService.reScheduleContent(req.details.orgId as string, content_id, date)
    }

    processContentReject = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            if (!req.details) throw new NotFoundError("Details Not Fount")
            const { content_id, reason } = req.body
            await this.providerService.rejectContent(req.details.orgId as string, content_id, reason)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

}

