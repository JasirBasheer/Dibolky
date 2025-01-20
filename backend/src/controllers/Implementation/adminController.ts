import { NextFunction, Request, Response } from 'express';
import { IAdminController } from '../Interface/IAdminController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { HTTPStatusCodes, NotFoundError, ResponseMessage, SendResponse } from 'mern.common';

@injectable()
export default  class AdminController implements IAdminController {
    private adminService: IAdminService;

    constructor(
        @inject('AdminService') adminService : IAdminService
    ) {
        this.adminService = adminService
    }



    async verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('reached here');
            
            const details = await this.adminService.verifyAdmin(req.details.email)
            SendResponse(res,HTTPStatusCodes.OK,ResponseMessage.VERIFIED,{ details, role: "Admin" })
        } catch (error: any) {
            next(error)
        }
    }


    async recentClients(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clients = await this.adminService.getRecentClients()
            SendResponse(res,HTTPStatusCodes.OK,ResponseMessage.SUCCESS,{clients})
        } catch (error) {
            next(error)
        }
    }

    async getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, role } = req.params
            const details = await this.adminService.getClient(id,role)
            if(!details)throw new NotFoundError("Client Not found")
            SendResponse(res,HTTPStatusCodes.OK,ResponseMessage.SUCCESS,{details})
        
        } catch (error) {
            next(error)
        }
    }

    async getAllClients(req:Request,res:Response, next: NextFunction):Promise<void> {
        try {
            const details = await this.adminService.getAllClients()
            if(!details)throw new NotFoundError("Client Not found")
            SendResponse(res,HTTPStatusCodes.OK,ResponseMessage.SUCCESS,{details})

        } catch (error) {
            next(error)
        }
    }


}


