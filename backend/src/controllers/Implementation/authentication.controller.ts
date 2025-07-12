import { Request, Response } from 'express';
import { IAuthenticationController } from '../Interface/IAuthenticationController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { IAgencyService } from '../../services/Interface/IAgencyService';
import { IAuthenticationService } from '../../services/Interface/IAuthenticationService';
import { IClientService } from '../../services/Interface/IClientService';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../../config/env.config';
import { blacklistToken } from '../../config/redis.config';
import {
    createTokens,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';
import { ROLES } from '../../utils/constants';

@injectable()
/** Implementation of Authentication Controller */
export default class AuthenticationController implements IAuthenticationController {
    private _adminService: IAdminService;
    private _agencyService: IAgencyService;
    private _authenticationService: IAuthenticationService;
    private _clientService: IClientService;

    /**
    * Initializes the AuthenticationController with required service dependencies.
    * @param _adminService - Service for handling admin authentication.
    * @param _agencyService - Service for handling agency authentication.
    * @param _authenticationService - Service for general authentication operations.
    * @param _clientService - Service for handling client authentication.
    * @param influencerService - Service for handling influencer authentication.
    * @param managerService - Service for handling manager authentication.
    */
    constructor(
        @inject('AdminService') adminService: IAdminService,
        @inject('AgencyService') agencyService: IAgencyService,
        @inject('AuthenticationService') authenticationService: IAuthenticationService,
        @inject('ClientService') clientService: IClientService,
    ) {
        this._adminService = adminService;
        this._agencyService = agencyService;
        this._authenticationService = authenticationService;
        this._clientService = clientService;
    }


    /**
    * Authenticates a user based on role and creates access and refresh tokens
    * @param req Express Request object containing email, password, and role
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    login = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { email, password, role }: { email: string, password: string, role: string } = req.body
            let id;

            switch (role) {
                case ROLES.ADMIN:
                    id = await this._adminService.adminLoginHandler(email, password);
                    break;
                case ROLES.AGENCY:
                    id = await this._agencyService.agencyLoginHandler(email, password);
                    break;
                case ROLES.CLIENT:
                    id = await this._clientService.clientLoginHandler(email, password);
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

    }


    /**
    * Logs out the user by blacklisting the access token and clearing authentication cookies
    * @param req Express Request object containing token details
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    logout = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            if(!req.tokenDetails)throw new NotFoundError("Details Not Fount")
            let token: string = req.cookies.accessToken ?? null
            await blacklistToken(req.tokenDetails, token)

            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }


    /**
    * Initiates the password reset process for a user
    * @param req Express Request object containing the user's email and role
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    forgotPassword = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { email, role }: { email: string, role: string } = req.body

            await this._authenticationService.resetPassword(email, role)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }


    /**
    * Resets  password using a reset token
    * @param req Express Request object containing the reset token and new password
    * @param res Express Response object
    * @param next Express NextFunction for error handling
    * @returns Promise resolving to void
    */
    resetPassword = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { token } = req.params as { token: string };
            const { newPassword } = req.body as { newPassword: string };

            await this._authenticationService.changePassword(token, newPassword)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }
}