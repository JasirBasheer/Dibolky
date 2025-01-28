import { createForgotPasswordData } from "../../shared/utils/mail.datas";
import { IAuthenticationService } from "../Interface/IAuthenticationService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ICompanyRepository } from "../../repositories/Interface/ICompanyRepository";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { generateToken, hashPassword, NotFoundError, sendMail, verifyToken } from "mern.common";
import { JWT_RESET_PASSWORD_SECRET } from "../../config/env";

@injectable()
export default class AuthenticationService implements IAuthenticationService {
    private agencyRepository: IAgencyRepository;
    private companyRepository: ICompanyRepository;
    private adminRepository: IAdminRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository : IAgencyRepository,
        @inject('CompanyRepository') companyRepository : ICompanyRepository,
        @inject('AdminRepository') adminRepository : IAdminRepository

    ) {
        this.agencyRepository = agencyRepository
        this.companyRepository = companyRepository
        this.adminRepository = adminRepository
    }

    async resetPassword(email: string, role: string): Promise<any> {
        let details
        if (role == "Agency") {
            details = await this.agencyRepository.findAgencyWithMail(email)
        } else if (role == "Company") {
            details = await this.companyRepository.findCompanyWithMail(email)
        } else if (role == "Admin") {
            details = await this.adminRepository.findAdminWithMail(email)
        }
        let jwtSecret = JWT_RESET_PASSWORD_SECRET || 'defaultsecretkey'
        if (!details) throw new NotFoundError('Account not found');
        let resetToken = await generateToken(jwtSecret,{id:details._id?.toString() || '', role:role})
        let data = createForgotPasswordData(details.name, email, `http://localhost:5173/${role.toLowerCase()}/reset-password/${resetToken}`)
        sendMail(email, "Forgot Password", data,
            (err:any,info:any)=>{
                if(err){
                    console.log("Error sending mail to user")
                }else{
                    console.log("Mail sended succeessfully")
                }
            })
        return true
    }



    async changePassword(token: string, password: string): Promise<any> {
        let jwtSecret = JWT_RESET_PASSWORD_SECRET || 'defaultsecretkey'
        const isValid = await verifyToken(jwtSecret,token)
        let hashedPassword = await hashPassword(password) || 'password'
        if (isValid.role == "Agency") {
            return await this.agencyRepository.changePassword(isValid.id, hashedPassword)
        } else if (isValid.role == "Company") {
            return await this.companyRepository.changePassword(isValid.id, hashedPassword)
        } else if (isValid.role == "Admin") {
            return await this.adminRepository.changePassword(isValid.id, hashedPassword)
        }
    }

}

