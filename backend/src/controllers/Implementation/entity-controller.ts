import { Request, Response } from 'express';
import { IEntityController } from '../Interface/IEntityController';
import { IEntityService } from '../../services/Interface/IEntityService';
import { inject, injectable } from 'tsyringe';
import { IChatService } from '../../services/Interface/IChatService';
import s3Client from '../../config/aws.config';
import { AWS_S3_BUCKET_NAME } from '../../config/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { CountryToCurrency } from '../../utils/currency-conversion.utils';
import { ParsedQs } from 'qs';
import {
    findCountryByIp,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';
import { linkedInAuthCallback } from '@/providers/linkedin';
import { xAuthCallback } from '@/providers/x';
import { FilterType } from '@/types/invoice';


@injectable()
export class EntityController implements IEntityController {
    private _entityService: IEntityService;
    private _chatService: IChatService;

    constructor(
        @inject('EntityService') entityService: IEntityService,
        @inject('ChatService') chatService: IChatService
    ) {
        this._entityService = entityService
        this._chatService = chatService
    }


    
    checkMail = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { mail } = req.body
            const isExists = await this._entityService.IsMailExists(mail)
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
    

            const createdAgency = await this._entityService.createAgency({organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate:finalPlanPurchasedRate, transactionId:finalTransactionId, paymentGateway:finalPaymentGateway, description, currency:currency ?? "trial"})
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
                menu = await this._entityService.getMenu(planId);
            } else if (role === "agency-client") {
                console.log(req.details.orgId, planId, "tehireaserfamsdjfklasdjflkasjfasdkl")
                menu = await this._entityService.getClientMenu(req.details.orgId as string, planId);
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
            const ownerDetails = await this._entityService.getOwner(req.details.orgId as string)

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ownerDetails: ownerDetails[0] })
        
    }

    getChats = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { userId } = req.params
            const chats = await this._chatService.getChats(req.details.orgId as string, userId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
        
    }

    getInbox = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { entity, user_id } = req.params
            const { selectedPlatforms, selectedPages } = req.body
            const users = await this._entityService.getInbox(req.details.orgId as string,entity, user_id, selectedPlatforms, selectedPages)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users })
        
    }

    sendMessage = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { conversation_id, access_token, message, type, media_url  } = req.body
            // const users = await this._entityService.getInbox(req.details.orgId as string,conversation_id, access_token, message, type, media_url)
            // SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { users })
        
    }


    getInboxMessages = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id, platform, conversationId } = req.params
            const messages = await this._entityService.getInboxMessages(req.details.orgId as string, user_id, platform, conversationId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { messages })
        
    }


    getChat = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { chatId } = req.body
            const chats = await this._chatService.getChat(req.details.orgId as string, chatId)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
        
    }

    getMessages = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
        const { userId } = req.body
        // const messages = await this._chatService.getMessages(req.details.orgId,userId)
    }


    createGroup = async(
        req: Request,
        res: Response,
    ): Promise<void> => {

            if (!req.details) throw new NotFoundError("request details not found")
            const { details, userId } = req.body
            const createdGroup = await this._chatService.createGroup(req.details?.orgId as string, userId, details)
            console.log(createdGroup);
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { group: createdGroup })
        

    }


    getAllProjects = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { page } = req.params
            const projects = await this._entityService.fetchAllProjects(req.details.orgId as string, Number(page))
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
            await this._entityService.saveContent({orgId:req.details.orgId as string, platform, platforms, user_id, files, metadata, contentType})

            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
       
    }


    getS3ViewUrl = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { key } = req.body
            const signedUrl = await this._entityService.getS3ViewUrl(key)

            res.json({ signedUrl });
       
    }

    fetchContents = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id } = req.params
            const contents = await this._entityService.fetchContents(req.details.orgId as string, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { contents })
    }

     getAllInvoices = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id, entity } = req.params
            const query = this._parseFilterQuery(req.query);
            const result = await this._entityService.getAllInvoices(req.details.orgId,entity, user_id,query)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,  result )
    }

      private _parseFilterQuery(query: ParsedQs): FilterType {
      return {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        query: String(query.query || ''),
        status: String(query.status || ''),
        sortBy: String(query.sortBy || 'createdAt'),
        sortOrder: String(query.sortOrder || 'desc'),
        overdues: String(query?.overdues || false),
        type: String(query.type || '')
      };
    }

     getAllTransactions = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id, entity } = req.params
            const query = this._parseFilterQuery(req.query);
            const result = await this._entityService.getAllTransactions(req.details.orgId,entity, user_id,query)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,  result )
    }


    updateProfile = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { role, details } = req.body
            const updatedProfile = await this._entityService.updateProfile(req.details.orgId as string, role, req.details?.role as string, details)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details: updatedProfile })
       
    }


    fetchAllScheduledContents = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { user_id } = req.params
            const scheduledContents = await this._entityService.getScheduledContent(req.details.orgId as string, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { scheduledContents })

       
    }


    getConnections = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            if (!req.details) throw new NotFoundError("request details not found")
            const { entity, user_id } = req.params
            console.log
            const connections = await this._entityService.getConnections(req.details.orgId as string, entity, user_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { connections:connections.validConnections,connectedPages:connections.connectedPages })
       
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


