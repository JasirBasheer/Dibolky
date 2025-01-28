
export interface ICompanyService {
    verifyOwner(id:string):Promise<any>;
    companyLoginHandler(email: string, password: string): Promise<any>;
}