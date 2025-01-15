import CompanyEntityController from "../../repositories/company/entityRepository";
import bcrypt from 'bcrypt'
import { CustomError } from "../../utils/CustomError";

class CompanyEntityService {
    private companyEntityController: CompanyEntityController;

    constructor() {
       this.companyEntityController = new CompanyEntityController()
    }

    async verifyOwner(email:string):Promise<any>{
        try {
          return await this.companyEntityController.findOwner(email)
        } catch (error) {
          throw error
        }
    }

     async companyLogin(email: string, password: string): Promise<any> {
            const ownerDetails = await this.companyEntityController.findOwner(email);
            if (!ownerDetails) {
                throw new CustomError('User not found',404);
            }
            if (ownerDetails.isBlocked) {
                throw new CustomError('Account is blocked',403);
            }
    
            const isValid = await bcrypt.compare(password, ownerDetails.password);
            if (!isValid) {
                throw new CustomError('Invalid credentials',401);
            }
    
            return ownerDetails;
    
         
        }


}


export default CompanyEntityService