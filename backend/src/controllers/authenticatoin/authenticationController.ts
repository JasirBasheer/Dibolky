import AdminService from '../../services/admin/adminService'
import { NextFunction, Request, Response } from 'express';
import AgencyEntityService from '../../services/agency/entityService';
import JwtService from '../../services/authentication/jwtService';
import CompanyEntityService from '../../services/company/companyService';
import PasswordService from '../../services/authentication/passwordService';

class AuthenticationController {
    private adminService: AdminService;
    private agencyEntityService: AgencyEntityService;
    private jwtService: JwtService;
    private companyEntityService: CompanyEntityService;
    private passwordService: PasswordService;


    constructor() {
        this.adminService = new AdminService();
        this.agencyEntityService = new AgencyEntityService();
        this.jwtService = new JwtService();
        this.companyEntityService = new CompanyEntityService();
        this.passwordService = new PasswordService()
        this.login = this.login.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this)
    }

    async login(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { email, password, role } = req.body

            if (role == "Admin") {
                await this.adminService.adminLogin(email,password)
                console.log('authenticated');
                
            } else if (role == "Agency") {
                await this.agencyEntityService.agencyLogin(email, password)
            } else if (role == "Company") {
                await this.companyEntityService.companyLogin(email, password)
            } else if(role == "Client") {
                // await this.companyEntityService.companyLogin(email, password)
            }

            let tokens = await this.jwtService.createTokens(email, role)
            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })
            res.cookie('accessToken', tokens.accessToken, {httpOnly: false,secure: false,maxAge: 2 * 60 * 1000 });
            return res.status(200).json({ success: true })

        } catch (error: any) {
            next(error);        
         }
    }



    async forgotPassword(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { email, role } = req.body
            let response = await this.passwordService.resetOwnerPassword(email, role)
            if (!response) return res.status(400).json({ success: false, message: "Account not found" })
            return res.status(200).json({ success: true })

        } catch (error: any) {
            next(error);        
        }
    }


    async resetPassword(req: Request, res: Response, next:NextFunction): Promise<any> {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            console.log("reached here")
            await this.passwordService.changePassword(token, newPassword)
            return res.status(200).json({ success: true })
        } catch (error:any) {
            next(error);        
        }
    }
}




export default new AuthenticationController()