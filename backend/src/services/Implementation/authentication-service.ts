import { IAuthenticationService } from "../Interface/IAuthenticationService";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../repositories/Interface/IAgencyRepository";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { CustomError, generateToken, hashPassword, NotFoundError, sendMail, verifyToken } from "mern.common";
import { IAdminType } from "../../types/admin";
import { IAgencyType } from "../../types/agency";
import { createForgotPasswordData } from "../../utils/mail.datas";
import { ROLES } from "../../utils/constants";
import { IClientRepository } from "../../repositories/Interface/IClientRepository";
import { UserMapper } from "@/mappers/shared/shared-mapper";
import { IClientType } from "@/types/client";
import { env } from "@/config";

@injectable()
export class AuthenticationService implements IAuthenticationService {
    private _agencyRepository: IAgencyRepository;
    private _adminRepository: IAdminRepository;
    private _clientRepository: IClientRepository;

    constructor(
        @inject('AgencyRepository') agencyRepository : IAgencyRepository,
        @inject('AdminRepository') adminRepository : IAdminRepository,
        @inject('ClientRepository') clientRepository : IClientRepository,

    ) {
        this._agencyRepository = agencyRepository
        this._adminRepository = adminRepository
        this._clientRepository = clientRepository
    }

    async resetPassword(
        email: string, 
        role: string
    ): Promise<boolean | null> {
        let details
        switch (role) {
            case ROLES.ADMIN:
                details = await this._adminRepository.findAdminWithMail(email)
                break;
            case ROLES.AGENCY:
                details = await this._agencyRepository.findAgencyWithMail(email)
                break;
            case ROLES.CLIENT:
                details = await this._clientRepository.findClientWithMail(email)
                break;
            default:
                throw new NotFoundError("Role not found please try again, later..")
        }

        if(!env.JWT.RESET_PASSWORD_SECRET)throw new NotFoundError("Jwt reset password key is not found")
        let jwtSecret = env.JWT.RESET_PASSWORD_SECRET 
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
    ): Promise<IAgencyType | IAdminType | IClientType> {
        if(!env.JWT.RESET_PASSWORD_SECRET)throw new NotFoundError("Jwt reset password key is not found")
        let jwtSecret = env.JWT.RESET_PASSWORD_SECRET 
        let changedPassword;
        const isValid = await verifyToken(jwtSecret,token)
        let hashedPassword = await hashPassword(password) || 'password'

        switch (isValid.role) {
            case ROLES.ADMIN:
                changedPassword =  await this._adminRepository.changePassword(isValid.id, hashedPassword)
                break;
            case ROLES.AGENCY:
                changedPassword =  await this._agencyRepository.changePassword(isValid.id, hashedPassword)
                break;
            case ROLES.CLIENT:
                changedPassword =  await this._clientRepository.changePassword(isValid.id, hashedPassword)
                break;
            default:
                throw new NotFoundError("Role not found please try again, later..")
        }
        if(!changedPassword)throw new CustomError("Error while Changing password",500)
          return  UserMapper.getMappedDetails(isValid.role,changedPassword)
    }

}

