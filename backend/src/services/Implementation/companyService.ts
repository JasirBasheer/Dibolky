import CompanyRepository from "../../repositories/Implementation/companyRepository";
import bcrypt from 'bcrypt'
import { ICompanyOwner } from "../../shared/types/companyTypes";
import { ICompanyService } from "../Interface/ICompanyService";
import { inject, injectable } from "tsyringe";
import { ICompanyRepository } from "../../repositories/Interface/ICompanyRepository";
import { NotFoundError, UnauthorizedError } from "mern.common";

@injectable()
export default class CompanyService implements ICompanyService {
  private companyRepository: CompanyRepository;

  constructor(
    @inject('CompanyRepository') companyRepository : ICompanyRepository
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
    if (!ownerDetails) throw new NotFoundError('User not found');
    if (ownerDetails.isBlocked) throw new UnauthorizedError('Account is blocked');

    const isValid = await bcrypt.compare(password, ownerDetails.password);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    return ownerDetails;
  }


}


