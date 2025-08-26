import { Request, Response } from 'express';
import { IAuthenticationController } from '../Interface/IAuthenticationController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { IAgencyService } from '../../services/Interface/IAgencyService';
import { IAuthenticationService } from '../../services/Interface/IAuthenticationService';
import { IClientService } from '../../services/Interface/IClientService';
import { blacklistToken } from '../../config/redis.config';
import {
    createTokens,
    HTTPStatusCodes,
    NotFoundError,
    ResponseMessage,
    SendResponse
} from 'mern.common';
import { ROLES } from '../../utils/constants';
import { env } from '@/config';

@injectable()
/** Implementation of Authentication Controller */
export class AuthenticationController implements IAuthenticationController {
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


    login = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { email, password, role } = req.body
            let id : string;

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

            let accessTokenSecret = env.JWT.ACCESS_SECRET || 'defaultAccessSecret';
            let refreshTokenSecret = env.JWT.REFRESH_SECRET || 'defaultRefreshSecret';

            let tokens = await createTokens(accessTokenSecret, refreshTokenSecret, { id, role })
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })
            res.cookie('accessToken', tokens.accessToken, { httpOnly: false, secure: false, maxAge: 2 * 60 * 1000 });
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)

    }


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

    forgotPassword = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { email, role } = req.body
            await this._authenticationService.resetPassword(email, role)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }


    resetPassword = async(
        req: Request,
        res: Response
    ): Promise<void> => {
            const { token } = req.params 
            const { newPassword } = req.body

            await this._authenticationService.changePassword(token, newPassword)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
    }
}
