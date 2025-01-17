import { ICompanyOwner } from "../../shared/types/companyTypes";

export interface ICompanyService {
    verifyOwner(email:string):Promise<any>;
    companyLoginHandler(email: string, password: string): Promise<ICompanyOwner | null>;
}