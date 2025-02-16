import mongoose from "mongoose";
import { planDetails } from "../../shared/types/admin.types";

export interface IEntityRepository {
    createAgency(newAgency:any):Promise<any>;
    createCompany(newCompany:any):Promise<any>;
    isAgencyMailExists(email:string):Promise<any>;
    createDepartment(departmentModel:any,details:any):Promise<any>;
    isCompanyMailExists(email:string):Promise<any>;
    saveDetailsInAgencyDb(id:string,orgId:string):Promise<any>;
    createTransaction(transaction:any):Promise<any>;
    getAllCompanyOwners():Promise<any>;
    getAllAgencyOwners():Promise<any>;
    getAllRecentCompanyOwners():Promise<any>;
    getAllRecentAgencyOwners():Promise<any>;
    getTransactionsWithOrgId(id:string):Promise<any>;
    createEmployee(orgId:string,tenantDatabase:any,name:string,email:string,role:string,password:string,department:string):Promise<any>;
    findEmployeeWithEmail(email:string):Promise<any>;
    fetchAllDepartments(tenantDb:any):Promise<any>;
    fetchAllEmployees(tenantDb:any):Promise<any>;
    fetchOwnerDetails(tenantDb:any):Promise<any>;
}