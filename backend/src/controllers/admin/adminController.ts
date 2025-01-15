import AdminService from '../../services/admin/adminService'
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../utils/CustomError';

class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
        this.registerAgency = this.registerAgency.bind(this);
        this.registerCompany = this.registerCompany.bind(this);
        this.getAllPlans = this.getAllPlans.bind(this);
        this.getPlan = this.getPlan.bind(this);
        this.checkMail = this.checkMail.bind(this);
        this.getMenu = this.getMenu.bind(this)
        this.verifyAdmin = this.verifyAdmin.bind(this)
        this.recentClients = this.recentClients.bind(this)
    }

    async checkMail(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { Mail, platform } = req.body
            const isExists = await this.adminService.IsMailExists(Mail, platform)
            if (isExists != null) return res.status(200).json({ isExists: isExists })
            res.status(400).json({ success: false })
        } catch (error) {
            next(error);
        }
    }

    async getAllPlans(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const data = await this.adminService.getAllPlans()
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
            const plans = await this.adminService.getAllPlans()
            const plan = await this.adminService.getPlan(plans, id, platform)
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
            const { organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate } = req.body

            console.log("req.bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            console.log(req.body);


            const createdAgency = await this.adminService.registerAgency(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password, planId, validity, planPurchasedRate)
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
            const createdCompany = await this.adminService.registerCompany(organizationName, name, email, address, websiteUrl, industry, contactNumber, logo, password)
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
                menu = await this.adminService.getAgencyMenu(planId);
            } else if (role === "Company") {
                menu = await this.adminService.getCompanyMenu(planId);
            } else if (role === "Admin") {
                console.log(role);
                
                menu ={
                    clients: {
                      label: 'All Clients',
                      icon: 'Users',
                      path:['/admin/clients']
                    },
                    plans: {
                      label: 'All Plans',
                      icon: 'GalleryVertical',
                      path:['/admin/plans']
                      },
                    reports:{
                        label:"Reports",
                        icon:'MessageSquareText',
                        path:['/admin/reports']
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

        async verifyAdmin(req:Request,res:Response, next:NextFunction):Promise<any>{
            try {
                const details = await this.adminService.getAdmin(req.details.email)
                if(!details)throw new CustomError('Account not found',404)
                return res.status(200).json({success:true,details,role:"Admin"})
            } catch (error:any) {
              next(error)
            }
        }


        async recentClients(req:Request,res:Response,next:NextFunction):Promise<any>{
            try {
                const clients = await this.adminService.getRecentClients()
                return res.status(200).json({success:true,clients})
                
            } catch (error) {
                next(error)
            }
        }



}


export default new AdminController()