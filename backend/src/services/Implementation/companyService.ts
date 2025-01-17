import CompanyRepository from "../../repositories/Implementation/companyRepository";
import bcrypt from 'bcrypt'
import { CustomError } from "../../shared/utils/CustomError";
import { ICompanyOwner } from "../../shared/types/companyTypes";
import { ICompanyService } from "../Interface/ICompanyService";
import { inject, injectable } from "tsyringe";
import { ICompanyRepository } from "../../repositories/Interface/ICompanyRepository";

@injectable()
export default class CompanyService implements ICompanyService {
  private companyRepository: CompanyRepository;

  constructor(
    @inject('ICompanyRepository') companyRepository : ICompanyRepository
  ) {
    this.companyRepository = companyRepository
  }

  async verifyOwner(email: string): Promise<any> {
    try {
      return await this.companyRepository.findCompanyWithMail(email)
    } catch (error) {
      throw error
    }
  }

  async companyLoginHandler(email: string, password: string): Promise<ICompanyOwner | null> {
    const ownerDetails = await this.companyRepository.findCompanyWithMail(email);
    if (!ownerDetails) throw new CustomError('User not found', 404);
    if (ownerDetails.isBlocked) throw new CustomError('Account is blocked', 403);

    const isValid = await bcrypt.compare(password, ownerDetails.password);
    if (!isValid) throw new CustomError('Invalid credentials', 401);

    return ownerDetails;
  }


}


