import { NextFunction, Request, Response } from 'express';
import { IEntityController } from '../Interface/IEntityController';
import { IEntityService } from '../../services/Interface/IEntityService';
import { inject, injectable } from 'tsyringe';
import { CountryToCurrency, getPriceConversionFunc } from '../../shared/utils/currency-conversion.utils';
import {
    findCountryByIp,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';
import mongoose from 'mongoose';
import { IChatService } from '../../services/Interface/IChatService';

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
                Agency: plans.Agency.map((item: any) => ({
                    ...item.toObject(),
                    price: PriceConverisonFunc(item.price as number)
                })),
                Company: plans.Company.map((item: any) => ({
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
            const plan = await this.entityService.getPlan(plans, id, platform)
            if (!plan) return SendResponse(res, HTTPStatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, { message: "Platform or Plan not found please try again" })
            let PriceConverisonFunc = getPriceConversionFunc(userCountry)
            const convertedPlanPrice = PriceConverisonFunc(plan.price)
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
            const { transaction_id } = req.body.response
            console.log(req.body.response)

            const createdAgency = await this.entityService.registerAgency(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, transaction_id, paymentGateway, description, currency)
            if (!createdAgency) return SendResponse(res, HTTPStatusCodes.UNAUTHORIZED, ResponseMessage.BAD_REQUEST)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
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
    async registerCompany(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password } = req.body

            const createdCompany = await this.entityService.registerCompany(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password)
            if (!createdCompany) return SendResponse(res, HTTPStatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED)
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
            const { role, planId } = req.params;
            let menu;

            if (role === "Agency") {
                menu = await this.entityService.getAgencyMenu(planId);
            } else if (role === "Company") {
                menu = await this.entityService.getCompanyMenu(planId);
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
        } catch (error: any) {
            next(error)
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


    async createDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { department, permissions }: { department: string, permissions: string[] } = req.body
            await this.entityService.createDepartment(req.tenantDb, department, permissions)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error) {
            next(error)
        }

    }


    async createEmployee(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name, email, role, department }: { name: string, email: string, role: string, department: string } = req.body
            await this.entityService.createEmployee(req.details.orgId, req.details.organizationName, req.tenantDb, name, email, role, department)
            SendResponse(res, HTTPStatusCodes.CREATED, ResponseMessage.CREATED)
        } catch (error) {
            next(error)
        }
    }


    async getDepartments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const departments = await this.entityService.getDepartments(req.tenantDb)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { departments })
        } catch (error) {
            next(error)
        }

    }

    async getEmployees(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const employees = await this.entityService.getEmployees(req.tenantDb)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { employees })
        } catch (error) {
            next(error)
        }
    }

    async getOwner(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            console.log("ownerDetails")
            const ownerDetails = await this.entityService.getOwner(req.tenantDb)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { ownerDetails: ownerDetails[0] })
        } catch (error) {

        }
    }

    async getChats(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const {userId} = req.body
        console.log("ownerDetailsssssssssssssssssssssssssssssssssssssss",userId)
        const chats = await this.chatService.getChats(req.tenantDb, userId)
        SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
    }


    async getChat(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { chatId } = req.body
        console.log(chatId);
        const chats = await this.chatService.getChat(req.tenantDb, chatId)
        SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { chats })
    }


    async createGroup(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { details, userId } = req.body
        const createdGroup = await this.chatService.createGroup(req.details?.orgId, userId, details)
        console.log(createdGroup);
        SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { group: createdGroup })

    }

}


