import { NextFunction, Request, Response } from "express";
import { IAgencyController } from "../Interface/IAgencyController";
import { IAgencyService } from "../../services/Interface/IAgencyService";
import { inject, injectable } from "tsyringe";
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from "mern.common";
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
            //validate the client datas --later
            await this.agencyService.createClient(req.tenantDb, orgId, name, email, industry, socialMedia_credentials, services, menu)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error: any) {
            next(error)
        }
    }


    async connectSocialPlatforms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { provider } = req.params
            const redirectUri: string = req.query.redirectUri as string;
            console.log('provider', provider, "redirectUri", redirectUri)
            let url;
            console.log(provider)
            if (provider == INSTAGRAM) {
                url = await createInstagramOAuthURL(redirectUri);
            } else if (provider == FACEBOOK) {
                url = await createFacebookOAuthURL(redirectUri)
            }
            res.send({ url: url });

        } catch (error) {

        }
    }
    async saveSocialPlatformTokenToDb(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            let response;
            const { provider, clientId } = req.params
            const { token } = req.body

            console.log(provider, clientId, token)

            if (clientId && clientId !== "Agency") {
                response = await this.clientService.saveClientSocialMediaTokens(clientId, provider, token, req.tenantDb)
            } else {
                // await this.agencyService.saveAgencySocialMediaTokens("Dibolky239033", provider.toLowerCase(), token, req.tenantDb)
            }

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)



        } catch (error) {
            console.error('Error saving social platform token:', error)
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
            const file = req.file;
            const { selectedContentType, selectedPlatforms, id , caption,isScheduled, scheduledDate } = req.body;

            if (!file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }

            const fileObject = new File([file.buffer], file.originalname.toLowerCase(), { type: file.mimetype });

            const contentUrl = await uploadToS3(fileObject, `test/${file.originalname.toLowerCase()}`, AWS_S3_BUCKET_NAME);
            const result = await this.agencyService.saveContentToDb(id, req.details.orgId, req.tenantDb, contentUrl, JSON.parse(selectedPlatforms), selectedContentType,caption,isScheduled,scheduledDate)
            if (result) SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);


        } catch (error) {
            next(error)

        }
    }
    async getReviewBucket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { clientId } = req.params
            console.log(clientId, "req.tenantDb")
            const reviewBucket = await this.agencyService.getReviewBucket(clientId, req.tenantDb)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { reviewBucket })

        } catch (error) {
            next(error)
        }
    }

    // async approveContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const { contentId, clientId } = req.params
    //         const content = await this.agencyService.getContent(req.tenantDb, contentId)
    //         if (!content)throw new Error('content does not exists')

    //         const client = await this.agencyService.getClient(req.tenantDb, clientId)
    //         if (!client)throw new Error('client does not exists')

    //         const access_token = client.socialMedia_credentials.instagram.accessToken
    //         const pages = await getPages(access_token)
    //         const pageId = pages?.data[0].id

    //         console.log(content, typeof content.url)
    //         const businessId = await fetchIGBusinessAccountId(pageId, access_token)
    //         const creationId = await uploadInstagramReelContent(access_token, businessId, content.url, `tes t cpation \n tags`)
    //         console.log(businessId)
    //         console.log(creationId)
    //         const status = await checkIGContainerStatus(access_token,creationId.id)
    //         if(!status)throw new Error('Error uploading content to instagram')
    //         const postedContent = await publishInstagramReel(access_token, businessId, creationId.id)
    //         if (postedContent) {
    //             await this.agencyService.changeContentStatus(req.tenantDb, contentId, "Approved")
    //             SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)

    //         }

    //     } catch (error) {
    //         next(error)
    //     }
    // }


}

