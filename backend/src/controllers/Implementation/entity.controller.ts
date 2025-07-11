import { Request, Response } from 'express';
import { IEntityController } from '../Interface/IEntityController';
import { IEntityService } from '../../services/Interface/IEntityService';
import { inject, injectable } from 'tsyringe';
import { IChatService } from '../../services/Interface/IChatService';
import s3Client from '../../config/aws.config';
import { AWS_S3_BUCKET_NAME } from '../../config/env.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { CountryToCurrency } from '../../utils/currency-conversion.utils';
import {
    findCountryByIp,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';
import { linkedInAuthCallback } from '@/providers/linkedin';
import { xAuthCallback } from '@/providers/x';


@injectable()
export default class EntityController implements IEntityController {
    private entityService: IEntityService;
    private chatService: IChatService;

    constructor(
        @inject('EntityService') entityService: IEntityService,
        @inject('ChatService') chatService: IChatService
    ) {
        this.entityService = entityService
        this.chatService = chatService
    }


    
    checkMail = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { mail } = req.body
            const isExists = await this.entityService.IsMailExists(mail)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { isExists: isExists })
    }

    
    createAgency = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, paymentGateway, description, currency } = req.body.details
            const { transaction_id } = req.body
            const isTrial = !transaction_id;

            const finalPlanPurchasedRate = isTrial ? 0 : planPurchasedRate;
            const finalTransactionId = isTrial ? "trial_user" : transaction_id;
            const finalPaymentGateway = isTrial ? "trial" : paymentGateway;
    

            const createdAgency = await this.entityService.createAgency({organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate:finalPlanPurchasedRate, transactionId:finalTransactionId, paymentGateway:finalPaymentGateway, description, currency:currency ?? "trial"})
            if (!createdAgency) return SendResponse(res, HTTPStatusCodes.UNAUTHORIZED, ResponseMessage.BAD_REQUEST)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        
    }




  
    getMenu = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { role, planId } = req.params;
            let menu;


            if (role === "agency") {
                menu = await this.entityService.getMenu(planId);
            } else if (role === "agency-client") {
                console.log(req.details.orgId, planId, "tehireaserfamsdjfklasdjflkasjfasdkl")
                menu = await this.entityService.getClientMenu(req.details.orgId as string, planId);
            } else if (role === "admin") {
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
        
    }


   
    getCountry = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            let ipAddressWithProxy = req.get('x-forwarded-for') || req.socket.remoteAddress;
            ipAddressWithProxy = ipAddressWithProxy == "::1" ? "49.36.231.0" : ipAddressWithProxy;
            const locationData = findCountryByIp(ipAddressWithProxy as string) || {country:"IN"}
            let userCountry = req.cookies?.userCountry
            if (userCountry) {
                userCountry = CountryToCurrency[locationData?.country as string]
                res.cookie('userCountry', userCountry, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: 'strict', path: '/' });
            }

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }


    getOwner = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const ownerDetails = await this.entityService.getOwner(req.details.orgId as string)

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ownerDetails: ownerDetails[0] })
        
    }

    getChats = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { userId } = req.params
            const chats = await this.chatService.getChats(req.details.orgId as string, userId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
        
    }


    getChat = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { chatId } = req.body
            const chats = await this.chatService.getChat(req.details.orgId as string, chatId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
        
    }

    getMessages = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
        const { userId } = req.body
        // const messages = await this.chatService.getMessages(req.details.orgId,userId)
    }


    createGroup = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { details, userId } = req.body
            const createdGroup = await this.chatService.createGroup(req.details?.orgId as string, userId, details)
            console.log(createdGroup);
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { group: createdGroup })
        

    }


    getAllProjects = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { page } = req.params
            const projects = await this.entityService.fetchAllProjects(req.details.orgId as string, Number(page))
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { projects: projects?.projects, totalPages: projects?.totalPages })
       
    }

    initiateS3BatchUpload = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { files } = req.body;

            const filesInfo = await Promise.all(
                files.map(async (file: { fileName: string; fileType: string; id: string }) => {
                    const key = `test/${uuidv4()}-${file.fileName}`;

                    const command = new PutObjectCommand({
                        Bucket: "dibolky-test-app",
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
        
    }


    getUploadS3Url = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
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
        
    }


    saveContent = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { platform, user_id } = req.params
            const { files, platforms, metadata, contentType } = req.body
            await this.entityService.saveContent(req.details.orgId as string, platform, platforms, user_id, files, metadata, contentType)

            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
       
    }


    getS3ViewUrl = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { key } = req.body
            const signedUrl = await this.entityService.getS3ViewUrl(key)

            res.json({ signedUrl });
       
    }

    fetchContents = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id } = req.params
            const contents = await this.entityService.fetchContents(req.details.orgId as string, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { contents })

       
    }


    updateProfile = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { role, details } = req.body
            const updatedProfile = await this.entityService.updateProfile(req.details.orgId as string, role, req.details?.role as string, details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details: updatedProfile })
       
    }


    fetchAllScheduledContents = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id } = req.params
            const scheduledContents = await this.entityService.getScheduledContent(req.details.orgId as string, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { scheduledContents })

       
    }


    getConnections = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { entity, user_id } = req.params
            console.log
            const connections = await this.entityService.getConnections(req.details.orgId as string, entity, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { connections })
       
    }

     handleLinkedinCallback = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { code, state } = req.body
            const token = await linkedInAuthCallback(code as string, state as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { token })

    }

    handleXCallback = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { code, state } = req.body
            const token = await xAuthCallback(code as string, state as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { token })

    }

}


