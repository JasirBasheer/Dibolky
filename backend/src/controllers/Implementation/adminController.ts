import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../shared/utils/CustomError';
import { IAdminController } from '../Interface/IAdminController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';

@injectable()
export default  class AdminController implements IAdminController {
    private adminService: IAdminService;

    constructor(
        @inject('IAdminService') adminService : IAdminService
    ) {
        this.adminService = adminService
    }



    async verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const details = await this.adminService.verifyAdmin(req.details.email)
            res.status(200).json({ success: true, details, role: "Admin" })
        } catch (error: any) {
            next(error)
        }
    }


    async recentClients(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clients = await this.adminService.getRecentClients()
            res.status(200).json({ success: true, clients })
        } catch (error) {
            next(error)
        }
    }

    async getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, role } = req.params
            const details = await this.adminService.getClient(id,role)
            if(!details)throw new CustomError('Client Not found',404)
            res.status(200).json({success:true,details})
        } catch (error) {
            next(error)
        }
    }

    async getAllClients(req:Request,res:Response, next: NextFunction):Promise<void> {
        try {
            const details = await this.adminService.getAllClients()
            if(!details)throw new CustomError('Client Not found',404)
            res.status(200).json({success:true,details})
        } catch (error) {
            next(error)
        }
    }


}


