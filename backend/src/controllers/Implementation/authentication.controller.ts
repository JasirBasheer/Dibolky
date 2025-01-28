import { NextFunction, Request, Response } from 'express';
import { IAuthenticationController } from '../Interface/IAuthenticationController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { IAgencyService } from '../../services/Interface/IAgencyService';
import { ICompanyService } from '../../services/Interface/ICompanyService';
import { IEmployeeService } from '../../services/Interface/IEmployeeService';
import { IAuthenticationService } from '../../services/Interface/IAuthenticationService';
import { createTokens, HTTPStatusCodes, ResponseMessage, SendResponse } from 'mern.common';
import { IClientService } from '../../services/Interface/IClientService';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../../config/env';

@injectable()
export default class AuthenticationController implements IAuthenticationController {
    private adminService: IAdminService;
    private agencyService: IAgencyService;
    private companyService: ICompanyService;
    private employeeService: IEmployeeService;
    private authenticationService: IAuthenticationService;
    private clientService: IClientService;


    constructor(
        @inject('AdminService') adminService: IAdminService,
        @inject('AgencyService') agencyService: IAgencyService,
        @inject('CompanyService') companyService: ICompanyService,
        @inject('EmployeeService') employeeService: IEmployeeService,
        @inject('AuthenticationService') authenticationService: IAuthenticationService,
        @inject('ClientService') clientService: IClientService,
    ) {
        this.adminService = adminService;
        this.agencyService = agencyService;
        this.companyService = companyService;
        this.employeeService = employeeService;
        this.authenticationService = authenticationService;
        this.clientService = clientService;
    }



    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, role }: { email: string, password: string, role: string } = req.body
            let id;

            if (role == "Admin") {
                id = await this.adminService.adminLoginHandler(email, password)
            } else if (role == "Agency") {
                id = await this.agencyService.agencyLoginHandler(email, password)
            } else if (role == "Company") {
                id = await this.companyService.companyLoginHandler(email, password)
            } else if (role == "Client") {
                id = await this.clientService.clientLoginHandler(email, password)
            } else if (role == "Employee") {
                id = await this.employeeService.employeeLoginHandler(email, password)
            }

            let accessTokenSecret = JWT_ACCESS_SECRET || 'defaultAccessSecret';
            let refreshTokenSecret = JWT_REFRESH_SECRET || 'defaultRefreshSecret';

            let tokens = await createTokens(accessTokenSecret, refreshTokenSecret, { id, role })
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })
            res.cookie('accessToken', tokens.accessToken, { httpOnly: false, secure: false, maxAge: 2 * 60 * 1000 });
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)

        } catch (error: any) {
            next(error);
        }
    }



    async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, role } = req.body
            let response = await this.authenticationService.resetPassword(email, role)
            if (!response) return res.status(400).json({ success: false, message: "Account not found" })
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)


        } catch (error: any) {
            next(error);
        }
    }


    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            await this.authenticationService.changePassword(token, newPassword)
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS)
        } catch (error: any) {
            next(error);
        }
    }
}




