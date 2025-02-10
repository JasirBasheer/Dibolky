import { planDetails } from "../../shared/types/admin.types";

export interface IEntityRepository {
    createAgency(newAgency:any):Promise<any>;
    createCompany(newCompany:any):Promise<any>;
    isAgencyMailExists(email:string):Promise<any>;
    createDepartment(details:any):Promise<any>;
    isCompanyMailExists(email:string):Promise<any>;
    saveDetailsInAgencyDb(id:string,orgId:string):Promise<any>;
    createTransaction(transaction:any):Promise<any>;
    getAllCompanyOwners():Promise<any>;
    getAllAgencyOwners():Promise<any>;
    getAllRecentCompanyOwners():Promise<any>;
    getAllRecentAgencyOwners():Promise<any>;
    getTransactionsWithOrgId(id:string):Promise<any>;

    
}