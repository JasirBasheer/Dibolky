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
import { QueryParser } from '@/utils';
import { IAgencyService } from '@/services';


@injectable()
/** Implementation of AdminController Controller */
export class AdminController implements IAdminController {
    private _adminService: IAdminService;
    private _agencyService: IAgencyService;

    /**
    * Initializes the AdminController with required service dependencies.
    * @param _adminService - Service for handling admin authentication.
    */
    constructor(
        @inject('AdminService') adminService: IAdminService,
        @inject('AgencyService') agencyService: IAgencyService
    ) {
        this._adminService = adminService
        this._agencyService = agencyService
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
            const details = await this._adminService.verifyAdmin(req.details._id as string)
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
    getClients = async (
        req: Request,
        res: Response,
    ): Promise<void> =>{
            const query = QueryParser.parseFilterQuery(req.query);
            const result = await this._adminService.getAllClients(query)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, result)
    }

    getTransactions = async (
        req: Request,
        res: Response,
    ): Promise<void> =>{
            const query = QueryParser.parseFilterQuery(req.query);
            const response = await this._adminService.getTransactions(query)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, response)
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

            const details = await this._adminService.getClient(client_id)
            if (!details) throw new NotFoundError("Client Not found")

            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS, { details })

    }

    toggleClientAccess = async(
        req: Request<{ client_id: string }>,
        res: Response,
    ): Promise<void> => {
            const { client_id } = req.params

            await this._agencyService.toggleAccess(client_id)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }

}


