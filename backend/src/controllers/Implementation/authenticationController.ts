import { NextFunction, Request, Response } from 'express';
import { createTokens } from '../../shared/utils/jwtUtils';
import { IAuthenticationController } from '../Interface/IAuthenticationController';
import { inject, injectable } from 'tsyringe';
import { IAdminService } from '../../services/Interface/IAdminService';
import { IAgencyService } from '../../services/Interface/IAgencyService';
import { ICompanyService } from '../../services/Interface/ICompanyService';
import { IEmployeeService } from '../../services/Interface/IEmployeeService';
import { IAuthenticationService } from '../../services/Interface/IAuthenticationService';

@injectable()
export default class AuthenticationController implements IAuthenticationController {
    private adminService: IAdminService;
    private agencyService: IAgencyService;
    private companyService: ICompanyService;
    private employeeService : IEmployeeService;
    private authenticationService:IAuthenticationService;



    constructor(
        @inject('IAdminService') adminService :IAdminService,
        @inject('IAgencyService') agencyService :IAgencyService,
        @inject('ICompanyService') companyService :ICompanyService,
        @inject('IEmployeeService') employeeService :IEmployeeService,
        @inject('IAuthenticationService') authenticationService :IAuthenticationService,
        ){
            this.adminService = adminService;
            this.agencyService = agencyService;
            this.companyService = companyService;
            this.employeeService = employeeService;
            this.authenticationService = authenticationService
        }



    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, role }: { email: string, password: string, role: string } = req.body

            if (role == "Employee") {
                await this.employeeService.employeeLoginHandler(email, password)
            } else if (role == "Agency") {
                await this.agencyService.agencyLoginHandler(email, password)
            } else if (role == "Company") {
                await this.companyService.companyLoginHandler(email, password)
            } else if (role == "Client") {
                // await this.companyService.companyLogin(email, password)
            } else if (role == "Admin") {
                await this.adminService.adminLoginHandler(email, password)
            }

            let tokens = await createTokens(email, role)
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })
            res.cookie('accessToken', tokens.accessToken, { httpOnly: false, secure: false, maxAge: 2 * 60 * 1000 });
            res.status(200).json({ success: true })

        } catch (error: any) {
            next(error);
        }
    }



    async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, role } = req.body
            let response = await this.authenticationService.resetPassword(email, role)
            if (!response) return res.status(400).json({ success: false, message: "Account not found" })
            return res.status(200).json({ success: true })

        } catch (error: any) {
            next(error);
        }
    }


    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            console.log("reached here")
            await this.authenticationService.changePassword(token, newPassword)
            return res.status(200).json({ success: true })
        } catch (error: any) {
            next(error);
        }
    }
}




