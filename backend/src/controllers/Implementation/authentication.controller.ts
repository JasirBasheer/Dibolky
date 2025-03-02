import { NextFunction, Request, Response } from 'express';
import { IAuthenticationController } from '../Interface/IAuthenticationController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { IAgencyService } from '../../services/Interface/IAgencyService';
import { IAuthenticationService } from '../../services/Interface/IAuthenticationService';
import { IClientService } from '../../services/Interface/IClientService';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../../config/env';
import { blacklistToken } from '../../config/redis';
import {
    createTokens,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';

@injectable()
/** Implementation of Authentication Controller */
export default class AuthenticationController implements IAuthenticationController {
    private adminService: IAdminService;
    private agencyService: IAgencyService;
    private authenticationService: IAuthenticationService;
    private clientService: IClientService;

    /**
    * Initializes the AuthenticationController with required service dependencies.
    * @param adminService - Service for handling admin authentication.
    * @param agencyService - Service for handling agency authentication.
    * @param authenticationService - Service for general authentication operations.
    * @param clientService - Service for handling client authentication.
    */
    constructor(
        @inject('AdminService') adminService: IAdminService,
        @inject('AgencyService') agencyService: IAgencyService,
        @inject('AuthenticationService') authenticationService: IAuthenticationService,
        @inject('ClientService') clientService: IClientService,
    ) {
        this.adminService = adminService;
        this.agencyService = agencyService;
        this.authenticationService = authenticationService;
        this.clientService = clientService;
    }


    /**
    * Authenticates a user based on role and creates access and refresh tokens
    * @param req Express Request object containing email, password, and role
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password, role }: { email: string, password: string, role: string } = req.body
            let id;

            switch (role) {
                case "Admin":
                    id = await this.adminService.adminLoginHandler(email, password);
                    break;
                case "agency":
                    id = await this.agencyService.agencyLoginHandler(email, password);
                    break;
                case "Client":
                    id = await this.clientService.clientLoginHandler(email, password);
                    break;
                default:
                    throw new Error('Invalid role specified');
            }

            let accessTokenSecret = JWT_ACCESS_SECRET || 'defaultAccessSecret';
            let refreshTokenSecret = JWT_REFRESH_SECRET || 'defaultRefreshSecret';

            let tokens = await createTokens(accessTokenSecret, refreshTokenSecret, { id, role })
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })
            res.cookie('accessToken', tokens.accessToken, { httpOnly: false, secure: false, maxAge: 2 * 60 * 1000 });
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)

        } catch (error: unknown) {
            next(error);
        }
    }


    /**
    * Logs out the user by blacklisting the access token and clearing authentication cookies
    * @param req Express Request object containing token details
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(!req.tokenDetails)throw new NotFoundError("Details Not Fount")
            let token: string = req.cookies.accessToken ?? null
            await blacklistToken(req.tokenDetails, token)

            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error: unknown) {
            next(error);
        }
    }


    /**
    * Initiates the password reset process for a user
    * @param req Express Request object containing the user's email and role
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    async forgotPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, role }: { email: string, role: string } = req.body

            await this.authenticationService.resetPassword(email, role)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error: unknown) {
            next(error);
        }
    }


    /**
    * Resets  password using a reset token
    * @param req Express Request object containing the reset token and new password
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { token } = req.params as { token: string };
            const { newPassword } = req.body as { newPassword: string };

            await this.authenticationService.changePassword(token, newPassword)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error: unknown) {
            next(error);
        }
    }
}




