import { IAuthenticationService } from "../Interface/IAuthenticationService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { CustomError, generateToken, hashPassword, NotFoundError, sendMail, verifyToken } from "mern.common";
import { JWT_RESET_PASSWORD_SECRET } from "../../config/env.config";
import { IAdmin } from "../../types/admin.types";
import { IAgency } from "../../types/agency.types";
import { createForgotPasswordData } from "../../utils/mail.datas";
import { ROLES } from "../../utils/constants.utils";

@injectable()
export default class AuthenticationService implements IAuthenticationService {
    private agencyRepository: IAgencyRepository;
    private adminRepository: IAdminRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository : IAgencyRepository,
        @inject('AdminRepository') adminRepository : IAdminRepository

    ) {
        this.agencyRepository = agencyRepository
        this.adminRepository = adminRepository
    }

    async resetPassword(
        email: string, 
        role: string
    ): Promise<boolean | null> {
        let details
        switch (role) {
            case ROLES.ADMIN:
                details = await this.adminRepository.findAdminWithMail(email)
                break;
            case ROLES.AGENCY:
                details = await this.agencyRepository.findAgencyWithMail(email)
                break;
            case ROLES.CLIENT:
                details = await this.agencyRepository.findAgencyWithMail(email)
                break;
            case ROLES.INFLUENCER:
                details = await this.agencyRepository.findAgencyWithMail(email)
                break;
            case ROLES.INFLUENCER:
                details = await this.agencyRepository.findAgencyWithMail(email)
                break; 
            default:
                throw new NotFoundError("Role not found please try again, later..")
        }

        if(!JWT_RESET_PASSWORD_SECRET)throw new NotFoundError("Jwt reset password key is not found")
        let jwtSecret = JWT_RESET_PASSWORD_SECRET 
        if (!details) throw new NotFoundError('Account not found');
        let resetToken = await generateToken(jwtSecret,{id:details._id?.toString() || '', role:role})
        let data = createForgotPasswordData(details.name, email, `http://localhost:5173/${role.toLowerCase()}/reset-password/${resetToken}`)
        sendMail(email, "Forgot Password", data,
            (err:unknown,info:unknown)=>{
                if(err){
                    console.log("Error sending mail to user")
                }else{
                    console.log("Mail sended succeessfully")
                }
            })
        return true
    }



    async changePassword(
        token: string, 
        password: string
    ): Promise<IAgency | IAdmin> {
        if(!JWT_RESET_PASSWORD_SECRET)throw new NotFoundError("Jwt reset password key is not found")
        let jwtSecret = JWT_RESET_PASSWORD_SECRET 
        let changedPassword;
        const isValid = await verifyToken(jwtSecret,token)
        let hashedPassword = await hashPassword(password) || 'password'

        switch (isValid.role) {
            case ROLES.ADMIN:
                changedPassword =  await this.adminRepository.changePassword(isValid.id, hashedPassword)
                break;
            case ROLES.AGENCY:
                changedPassword =  await this.agencyRepository.changePassword(isValid.id, hashedPassword)
                break;
            case ROLES.CLIENT:
                changedPassword =  await this.adminRepository.changePassword(isValid.id, hashedPassword)
                break;
            case ROLES.INFLUENCER:
                changedPassword =  await this.adminRepository.changePassword(isValid.id, hashedPassword)
                break;
            case ROLES.INFLUENCER:
                changedPassword =  await this.adminRepository.changePassword(isValid.id, hashedPassword)
                break; 
            default:
                throw new NotFoundError("Role not found please try again, later..")
        }
        if(!changedPassword)throw new CustomError("Error while Changing password",500)
        return changedPassword
    }

}

