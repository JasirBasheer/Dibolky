import { NextFunction, Request, Response } from 'express';
import { IEntityController } from '../Interface/IEntityController';
import { IEntityService } from '../../services/Interface/IEntityService';
import { inject, injectable } from 'tsyringe';
import { findCountryByIp, HTTPStatusCodes, ResponseMessage, SendResponse } from 'mern.common';
import { getPriceConversionFunc } from '../../shared/utils/currency-conversion.util';

@injectable()
export default class EntityController implements IEntityController {
    private entityService: IEntityService;

    constructor(
        @inject('EntityService') entityService: IEntityService
    ) {
        this.entityService = entityService
    }


    /**
    * Handles mail existence in DB for a given platform.
    * @param req - Express request object containing `Mail` and `platform` in the body.
    * @param res - Express response object used to return the result.
    * @param next - Express next function for error handling.
    * @returns Promise<void> - Sends a response with the existence status or passes an error to `next`.
    */

    async checkMail(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let ipAddressWithProxy = req.get('x-forwarded-for') || req.socket.remoteAddress;
            ipAddressWithProxy = ipAddressWithProxy == "::1" ? "49.36.231.0" : ipAddressWithProxy;
            const locationData = findCountryByIp(ipAddressWithProxy as string)
            let userCountry = req.cookies?.userCountry
            if(!userCountry){
                userCountry = !locationData?.country ? 'INR' : locationData.country
                res.cookie('userCountry', userCountry, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false, sameSite: 'strict', path: '/' });
            }

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
    
            if (plans) return SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { plans : convertedPlans})
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

    async getPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, platform } = req.body
            const userCountry = req.cookies.userCountry
            const plans = await this.entityService.getAllPlans()
            const plan = await this.entityService.getPlan(plans, id, platform)
            if (!plan) return SendResponse(res, HTTPStatusCodes.BAD_REQUEST, ResponseMessage.BAD_REQUEST, { message: "Platform or Plan not found please try again" })
            let PriceConverisonFunc = getPriceConversionFunc(userCountry)
            console.log(userCountry);
            const convertedPlanPrice = PriceConverisonFunc(plan.price)
            console.log(convertedPlanPrice);
            
            plan.price = convertedPlanPrice
            console.log(convertedPlanPrice)
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

    async registerAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, paymentGateway, description,currency } = req.body.details
            const { razorpay_payment_id } = req.body.response
            console.log(req.body.response)

            const createdAgency = await this.entityService.registerAgency(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, razorpay_payment_id, paymentGateway, description,currency)
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

    async registerCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password } = req.body
            const createdCompany = await this.entityService.registerCompany(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password)
            if (!createdCompany) return SendResponse(res, HTTPStatusCodes.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED)
            console.log('company created successfully');
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

    async getMenu(req: Request, res: Response, next: NextFunction): Promise<void> {
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
}


