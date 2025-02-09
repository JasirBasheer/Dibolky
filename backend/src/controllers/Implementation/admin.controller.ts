import { NextFunction, Request, Response } from 'express';
import { IAdminController } from '../Interface/IAdminController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { 
    HTTPStatusCodes, 
    NotFoundError, 
    ResponseMessage, 
    SendResponse 
} from 'mern.common';

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
    async verifyAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const details = await this.adminService.verifyAdmin(req.details._id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.VERIFIED, { details, role: "Admin" })
        } catch (error: any) {
            next(error)
        }
    }


    /**
    * Retrieves the list of recent clients.
    * @param req Express Request object
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    * @throws NotFoundError if clients are not found or any other errors during the process
    */
    async recentClients(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const clients = await this.adminService.getRecentClients()
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { clients })
        } catch (error) {
            next(error)
        }
    }


    /**
    * Fetches a specific client based on the provided ID and role.
    * @param req - Express Request object containing the client ID and role in params
    * @param res - Express Response object
    * @param next - Express NextFunction for error handling
    * @returns A response with the client details or an error message
    */
    async getClient(
        req: Request<{ id: string, role: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id, role } = req.params

            const details = await this.adminService.getClient(id, role)
            if (!details) throw new NotFoundError("Client Not found")

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })

        } catch (error) {
            next(error)
        }
    }


    /**
    * Fetches all clients from the database.
    * @param req - Express Request object
    * @param res - Express Response object
    * @param next - Express NextFunction for error handling
    * @returns A response with the list of clients or an error message
    */
    async getAllClients(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const details = await this.adminService.getAllClients()
            if (!details) throw new NotFoundError("Clients Not found")

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })
        } catch (error) {
            next(error)
        }
    }
}


