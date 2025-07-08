import { Request, Response } from 'express';
import { IAdminController } from '../Interface/IAdminController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import {
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';
import { PlanDetailsDTO } from '@/dto';
import { IPlan } from '@/types/admin';

@injectable()
/** Implementation of AdminController Controller */
export default class AdminController implements IAdminController {
    private adminService: IAdminService;

    /**
    * Initializes the AdminController with required service dependencies.
    * @param adminService - Service for handling admin authentication.
    */
    constructor(
        @inject('AdminService') adminService: IAdminService
    ) {
        this.adminService = adminService
    }


    /**
     * Verifies if the provided user is an admin.
     * @param req Express Request object containing the user details (e.g., user ID)
     * @param res Express Response object
     * @param next Express NextFunction for error handling
     * @returns Promise resolving to void
     * @throws NotFoundError or other errors if verification fails
     */
    verifyAdmin = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            if(!req.details)throw new NotFoundError("Details Not Fount")
            console.log("reached here") 
            const details = await this.adminService.verifyAdmin(req.details._id as string)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.VERIFIED, { details, role: "admin" })
    }


    /**
    * Retrieves the list of recent clients.
    * @param req Express Request object
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    * @throws NotFoundError if clients are not found or any other errors during the process
    */
    recentClients = async (
        req: Request,
        res: Response,
    ): Promise<void> =>{
            const clients = await this.adminService.getRecentClients()
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })
    }


    /**
    * Fetches a specific client based on the provided ID and role.
    * @param req - Express Request object containing the client ID and role in params
    * @param res - Express Response object
    * @param next - Express NextFunction for error handling
    * @returns A response with the client details or an error message
    */
    getClient = async(
        req: Request<{ client_id: string }>,
        res: Response,
    ): Promise<void> => {
            const { client_id } = req.params

            const details = await this.adminService.getClient(client_id)
            if (!details) throw new NotFoundError("Client Not found")

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })

    }


    /**
    * Fetches all clients from the database.
    * @param req - Express Request object
    * @param res - Express Response object
    * @param next - Express NextFunction for error handling
    * @returns A response with the list of clients or an error message
    */
    getAllClients = async(
        req: Request,
        res: Response,
    ): Promise<void> =>{
            const details = await this.adminService.getAllClients()
            if (!details) throw new NotFoundError("Clients Not found")

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
    }




}


