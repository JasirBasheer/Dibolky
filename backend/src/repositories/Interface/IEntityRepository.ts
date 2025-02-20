
export interface IEntityRepository {
    createAgency(newAgency:any):Promise<any>;
    isAgencyMailExists(email:string):Promise<any>;
    saveDetailsInAgencyDb(id:string,orgId:string):Promise<any>;
    createTransaction(transaction:any):Promise<any>;
    getAllAgencyOwners():Promise<any>;
    getAllRecentAgencyOwners():Promise<any>;
    getTransactionsWithOrgId(id:string):Promise<any>;
   
    
    fetchOwnerDetails(tenantDb:any):Promise<any>;
    fetchAllProjects(projectsModel:any):Promise<any>
    fetchProjectTasks(taskModel:any,projectId:string):Promise<any>

}