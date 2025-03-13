import { NextFunction, Request, Response } from 'express';
import { IEntityController } from '../Interface/IEntityController';
import { IEntityService } from '../../services/Interface/IEntityService';
import { inject, injectable } from 'tsyringe';
import { IChatService } from '../../services/Interface/IChatService';
import s3Client from '../../config/aws.config';
import { AWS_S3_BUCKET_NAME } from '../../config/env.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { IPlan } from '../../types/admin.types';
import { CountryToCurrency, getPriceConversionFunc } from '../../utils/currency-conversion.utils';
import {
    findCountryByIp,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';


@injectable()
/** Implementation of Entity Controller */
export default class EntityController implements IEntityController {
    private entityService: IEntityService;
    private chatService: IChatService;
    /**
    * Initializes the EntityController with required service dependencies.
    * @param entityService - Service for general entity operations.
    */
    constructor(
        @inject('EntityService') entityService: IEntityService,
        @inject('ChatService') chatService: IChatService
    ) {
        this.entityService = entityService
        this.chatService = chatService
    }


    /**
    * Handles mail existence in DB for a given platform.
    * @param req - Express request object containing `Mail` and `platform` in the body.
    * @param res - Express response object used to return the result.
    * @param next - Express next function for error handling.
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
    */
    async checkMail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { Mail, platform } = req.body
            const isExists = await this.entityService.IsMailExists(Mail, platform)

            if (isExists != null) return SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.BAD_REQUEST, { isExists: isExists })
            SendResponse(res, HTTPStatusCodes.BAD_REQUEST, ResponseMessage.NOT_FOUND)
        } catch (error) {
            next(error);
        }
    }


    /**
    * Handles mail existence check for a given platform.
    * @param req - Express request object containing `Mail` and `platform` in the body.
    * @param res - Express response object used to return the result.
    * @param next - Express next function for error handling.
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
    */
    async getAllPlans(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let userCountry = req.cookies?.userCountry
            let plans = await this.entityService.getAllPlans()

            let PriceConverisonFunc = getPriceConversionFunc(userCountry)

            const convertedPlans = {
                Agency: plans?.Agency.map((item: IPlan) => ({
                    ...item.toObject(),
                    price: PriceConverisonFunc(item.price as number)
                })),
                Influencer: plans?.Influencer.map((item: IPlan) => ({
                    ...item.toObject(),
                    price: PriceConverisonFunc(item.price as number)
                }))
            };

            if (plans) return SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plans: convertedPlans })
            SendResponse(res, HTTPStatusCodes.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
        } catch (error) {
            next(error);
        }
    }


    /**
    * Handles mail existence check for a given platform.
    * @param req - Express request object containing `Mail` and `platform` in the body.
    * @param res - Express response object used to return the result.
    * @param next - Express next function for error handling.
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
    */
    async getPlan(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id, platform } = req.body
            const userCountry = req.cookies.userCountry
            const plans = await this.entityService.getAllPlans()
            const plan = await this.entityService.getPlan(plans, id, platform);
            if (!plan) return SendResponse(res, HTTPStatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, { message: "Platform or Plan not found please try again" })
            let PriceConverisonFunc = getPriceConversionFunc(userCountry)
            const convertedPlanPrice = PriceConverisonFunc(plan.price as number)
            plan.price = convertedPlanPrice
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plan })
        } catch (error) {
            next(error);
        }
    }


    /**
    * Handles mail existence check for a given platform.
    * @param req - Express request object containing `Mail` and `platform` in the body.
    * @param res - Express response object used to return the result.
    * @param next - Express next function for error handling.
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
    */
    async registerAgency(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, paymentGateway, description, currency } = req.body.details
            const { transaction_id } = req.body

            const createdAgency = await this.entityService.registerAgency(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, transaction_id, paymentGateway, description, currency)
            if (!createdAgency) return SendResponse(res, HTTPStatusCodes.UNAUTHORIZED, ResponseMessage.BAD_REQUEST)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error) {
            next(error);
        }

    }


    async createInfluencer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, paymentGateway, description, currency } = req.body.details
            const { transaction_id } = req.body

            const createdAgency = await this.entityService.createInfluencer(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, transaction_id, paymentGateway, description, currency)
            if (!createdAgency) return SendResponse(res, HTTPStatusCodes.UNAUTHORIZED, ResponseMessage.BAD_REQUEST)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error) {
            next(error);
        }
    }

    /**
    * Returns menu for the given role.
    * @param req - Express request object containing `role` and `planId` in the params.
    * @param res - Express response object used to return the menu.
    * @param next - Express next function for error handling.
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
    */
    async getMenu(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { role, planId } = req.params;
            let menu;


            if (role === "agency") {
                menu = await this.entityService.getAgencyMenu(planId);
            } else if (role === "agency-client") {
                console.log(req.details.orgId, planId, "tehireaserfamsdjfklasdjflkasjfasdkl")
                menu = await this.entityService.getClientMenu(req.details.orgId as string, planId);
            } else if (role === "Admin") {
                menu = {
                    clients: {
                        label: 'All Clients',
                        icon: 'Users',
                        path: ['/admin/clients']
                    },
                    plans: {
                        label: 'All Plans',
                        icon: 'GalleryVertical',
                        path: ['/admin/plans']
                    },
                    reports: {
                        label: "Reports",
                        icon: 'MessageSquareText',
                        path: ['/admin/reports']
                    }
                }
            } else {
                return SendResponse(res, HTTPStatusCodes.BAD_REQUEST, "Invalid role provided")
            }
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { menu })
        } catch (error: unknown) {
            next(error);
        }
    }


    /**
     * Retrieves the user's country based on their IP address and sets it in a cookie.
     * @param req Express Request object
     * @param res Express Response object
     * @param next Express NextFunction for error handling
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
     */
    async getCountry(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let ipAddressWithProxy = req.get('x-forwarded-for') || req.socket.remoteAddress;
            ipAddressWithProxy = ipAddressWithProxy == "::1" ? "49.36.231.0" : ipAddressWithProxy;
            const locationData = findCountryByIp(ipAddressWithProxy as string)
            let userCountry = req.cookies?.userCountry
            if (!userCountry) {
                userCountry = CountryToCurrency[locationData?.country as string]
                res.cookie('userCountry', userCountry, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: 'strict', path: '/' });
            }
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error) {
            next(error);
        }
    }


    async getOwner(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const ownerDetails = await this.entityService.getOwner(req.details.orgId as string)

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ownerDetails: ownerDetails[0] })
        } catch (error) {
            next(error);
        }
    }

    async getChats(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            if (!req.details) throw new NotFoundError("request details not found")
            const { userId } = req.params
            const chats = await this.chatService.getChats(req.details.orgId as string, userId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
        } catch (error) {
            next(error);
        }
    }


    async getChat(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            if (!req.details) throw new NotFoundError("request details not found")
            const { chatId } = req.body
            const chats = await this.chatService.getChat(req.details.orgId as string, chatId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
        } catch (error) {
            next(error);
        }
    }

    async getMessages(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { userId } = req.body
        // const messages = await this.chatService.getMessages(req.details.orgId,userId)
    }


    async createGroup(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            if (!req.details) throw new NotFoundError("request details not found")
            const { details, userId } = req.body
            const createdGroup = await this.chatService.createGroup(req.details?.orgId as string, userId, details)
            console.log(createdGroup);
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { group: createdGroup })
        } catch (error) {
            next(error);

        }

    }


    async getAllProjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { page } = req.params
            const projects = await this.entityService.fetchAllProjects(req.details.orgId as string, Number(page))
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { projects: projects?.projects, totalPages: projects?.totalPages })
        } catch (error) {
            next(error)
        }
    }

    async initiateS3BatchUpload(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { files } = req.body;

            const filesInfo = await Promise.all(
                files.map(async (file: { fileName: string; fileType: string; id: string }) => {
                    const key = `test/${uuidv4()}-${file.fileName}`;

                    const command = new PutObjectCommand({
                        Bucket: AWS_S3_BUCKET_NAME,
                        Key: key,
                        ContentType: file.fileType,
                        ContentDisposition: 'inline',
                    });

                    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

                    return {
                        fileId: file.id,
                        key,
                        url,
                        contentType: file.fileType,
                    };
                })
            );

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { filesInfo });
        } catch (error) {
            next(error);
        }
    }


    async getUploadS3Url(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { file } = req.body;
            console.log(file)

            const key = `test/${uuidv4()}-${file.fileName}`;

            const command = new PutObjectCommand({
                Bucket: AWS_S3_BUCKET_NAME,
                Key: key,
                ContentType: file.fileType,
                ContentDisposition: 'inline',
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

            const s3file = {
                key,
                url,
                contentType: file.fileType,
            };

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { s3file });
        } catch (error) {
            next(error);
        }
    }


    async saveContent(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { platform, user_id } = req.params
            const { files, platforms, metadata, contentType } = req.body
            await this.entityService.saveContent(req.details.orgId as string, platform, platforms, user_id, files, metadata, contentType)

            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error) {
            next(error)
        }
    }


    async getS3ViewUrl(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { key } = req.body
            const signedUrl = await this.entityService.getS3ViewUrl(key)

            res.json({ signedUrl });
        } catch (error) {
            next(error)
        }
    }

    async fetchContents(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id } = req.params
            const reviewBucket = await this.entityService.fetchContents(req.details.orgId as string, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { reviewBucket })

        } catch (error) {
            next(error)
        }
    }


    async updateProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { role, details } = req.body
            const updatedProfile = await this.entityService.updateProfile(req.details.orgId as string, role, req.details?.role as string, details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details: updatedProfile })
        } catch (error) {
            next(error)
        }
    }


    async fetchAllScheduledContents(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id } = req.params
            const scheduledContents = await this.entityService.getScheduledContent(req.details.orgId as string, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { scheduledContents })

        } catch (error) {
            next(error)
        }
    }


    async getConnections(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.details) throw new NotFoundError("request details not found")
            const { entity, user_id } = req.params
            console.log
            const connections = await this.entityService.getConnections(req.details.orgId as string, entity, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { connections })
        } catch (error) {
            next(error)
        }
    }



}


