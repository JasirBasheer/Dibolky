import { ICompanyOwner } from "../../shared/types/company.types";

export interface ICompanyRepository {
    findCompanyWithMail(email: string): Promise<ICompanyOwner | null>
    findCompanyWithId(id: string): Promise<ICompanyOwner | null>
    changePassword(id: string,password: string): Promise<any | null>
  }
  