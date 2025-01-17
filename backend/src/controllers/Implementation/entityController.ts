import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../shared/utils/CustomError';
import { IEntityController } from '../Interface/IEntityController';
import { IEntityService } from '../../services/Interface/IEntityService';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class EntityController implements IEntityController {
    private entityService: IEntityService;

    constructor(
        @inject('IEntityService') entityService : IEntityService 
    ) {
        this.entityService = entityService
    }

    async checkMail(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { Mail, platform } = req.body
            const isExists = await this.entityService.IsMailExists(Mail, platform)
            if (isExists != null) return res.status(200).json({ isExists: isExists })
            res.status(400).json({ success: false })
        } catch (error) {
            next(error);
        }
    }

    async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const data = await this.entityService.getAllPlans()
            if (data) {
                return res.status(200).json({ data })
            }
            return res.status(400).json({ success: false })

        } catch (error) {
            next(error);
        }
    }


    async getPlan(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { id, platform } = req.body
            const plans = await this.entityService.getAllPlans()
            const plan = await this.entityService.getPlan(plans, id, platform)
            if (!plan) {
                return res.status(400).json({ message: "Platform or Plan not found please try again" })
            }
            return res.status(200).json({ success: true, plan })
        } catch (error) {
            next(error);
        }
    }

    async registerAgency(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, paymentGateway, description } = req.body.details
            const { razorpay_payment_id } = req.body.response

            const createdAgency = await this.entityService.registerAgency(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate, razorpay_payment_id, paymentGateway, description)
            if (!createdAgency) {
                return res.status(401).json({ success: false })
            }
            console.log('agency created successfully');
            return res.status(201).json({ success: true });

        } catch (error) {
            next(error);
        }

    }

    async registerCompany(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password } = req.body
            const createdCompany = await this.entityService.registerCompany(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password)
            if (!createdCompany) {
                return res.status(401).json({ success: false })
            }
            console.log('company created successfully');
            return res.status(201).json({ success: true });
        } catch (error) {
            next(error);
        }
    }


    async getMenu(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { role, planId } = req.params;
            let menu;

            if (role === "Agency") {
                menu = await this.entityService.getAgencyMenu(planId);
            } else if (role === "Company") {
                menu = await this.entityService.getCompanyMenu(planId);
            } else if (role === "Admin") {
                console.log(role);

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
                return res.status(400).json({ success: false, message: "Invalid role provided." });
            }

            return res.status(200).json({ success: true, menu });
        } catch (error: any) {
            console.error("Error in getMenu:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch menu. Please try again later.",
                error: error.message,
            });
        }
    }
}


