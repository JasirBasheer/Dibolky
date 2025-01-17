import { CustomError } from "../../shared/utils/CustomError";
import { generateResetToken, verifyResetToken } from "../../shared/utils/jwtUtils";
import { createForgotPasswordData, sendMail } from "../../shared/utils/nodeMailer";
import { hashPassword } from "../../shared/utils/passwordUtils";
import { IAuthenticationService } from "../Interface/IAuthenticationService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { ICompanyRepository } from "../../repositories/Interface/ICompanyRepository";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";

@injectable()
export default class AuthenticationService implements IAuthenticationService {
    private agencyRepository: IAgencyRepository;
    private companyRepository: ICompanyRepository;
    private adminRepository: IAdminRepository;

    constructor(
        @inject('IAgencyRepository') agencyRepository : IAgencyRepository,
        @inject('ICompanyRepository') companyRepository : ICompanyRepository,
        @inject('IAdminRepository') adminRepository : IAdminRepository

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

        if (!details) throw new CustomError('Account not found', 404);
        let resetToken = await generateResetToken(details._id?.toString() || '', role)
        let data = createForgotPasswordData(details.name, email, `http://localhost:5173/${role.toLowerCase()}/reset-password/${resetToken}`)
        sendMail(email, "Forgot Password", data)
        return true
    }



    async changePassword(token: string, password: string): Promise<any> {
        const isValid = await verifyResetToken(token)
        console.log(isValid)
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

