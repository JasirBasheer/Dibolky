import AgencyEntityRepository from "../../repositories/agency/entityRepository";
import CompanyEntityController from "../../repositories/company/entityRepository";
import { CustomError } from "../../utils/CustomError";
import { generateResetToken, verifyResetToken } from "../../utils/jwtUtils";
import { createForgotPasswordData, sendMail } from "../../utils/nodeMailer";
import { hashPassword } from "../../utils/passwordUtils";
import AdminRepository from '../../repositories/admin/adminRepository'

class PasswordService {
    private agencyEntityRepository: AgencyEntityRepository;
    private companyEntityController: CompanyEntityController;
    private adminRepository : AdminRepository;

    constructor() {
        this.agencyEntityRepository = new AgencyEntityRepository()
        this.companyEntityController = new CompanyEntityController()
        this.adminRepository = new AdminRepository()
    }

    async resetOwnerPassword(email: string, role: string): Promise<any> {
        try {
            let details
            if (role == "Agency") {
                details = await this.agencyEntityRepository.findAgencyOwner(email)
            } else if (role == "Company") {
                details = await this.companyEntityController.findOwner(email)
            }else if(role =="Admin"){
                details = await this.adminRepository.getAdmin(email)
            }

            if (!details) throw new CustomError('Account not found',404);

            let resetToken = await generateResetToken(details._id,role)
            let data = createForgotPasswordData(details.name, email, `http://localhost:5173/${role.toLowerCase()}/reset-password/${resetToken}`)
            sendMail(email, "Forgot Password", data)
            return true
        } catch (error) {
            throw error
        }
    }


    
        async changePassword(token:string,password:string):Promise<any>{
            try {
                const isValid = await verifyResetToken(token)
                console.log(isValid)
                let hashedPassword = await hashPassword(password) || 'password'
                if(isValid.role =="Agency"){
                    return await this.agencyEntityRepository.changePassword(isValid.id,hashedPassword)           
                }else if(isValid.role == "Company"){
                    return await this.companyEntityController.changePassword(isValid.id,hashedPassword)           
                }else if(isValid.role == "Admin"){
                    return await this.adminRepository.changePassword(isValid.id,hashedPassword)
                }
            } catch (error) {
                throw error
            }
    
        }
    


}

export default PasswordService