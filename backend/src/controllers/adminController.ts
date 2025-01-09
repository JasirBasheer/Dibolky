import AdminService from '../services/admin/adminService'
import { Request, Response } from 'express';

class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
        this.registerAgency = this.registerAgency.bind(this);
        this.registerCompany = this.registerCompany.bind(this);
    }

    async registerAgency(req: Request, res: Response):Promise<any> {
        try {
            const { agencyName, ownerName, email, address, websiteUrl, industry, contactNumber, platformEmail, logo, password } = req.body
            console.log('reached controller')
            const createdAgency = await this.adminService.registerAgency(agencyName, ownerName, email, address, websiteUrl, industry, contactNumber, platformEmail, logo, password)
            if(!createdAgency){
                return res.status(401).json({success:false})
            }
            console.log('agency created successfully');
            return res.status(201).json({ success: true });

        } catch (error) {
            console.error('Error creating agency:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }

    }

    async registerCompany(req:Request,res:Response):Promise<any>{
        try {
            const { companyName, ownerName, email, address, websiteUrl, industry, contactNumber, platformEmail, logo, password } = req.body
            const createdCompany = await this.adminService.registerCompany(companyName, ownerName, email, address, websiteUrl, industry, contactNumber, platformEmail, logo, password)
            if(!createdCompany){
                return res.status(401).json({success:false})
            }
            console.log('company created successfully');
            return res.status(201).json({ success: true });
        } catch (error) {
            console.error('Error creating company:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


}


export default new AdminController()