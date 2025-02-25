
export interface IEntityService {
    getAllPlans(): Promise<any>;
    IsMailExists(Mail: string, platform: string): Promise<any>;
    getPlan(plans: any, id: any, platform: any):Promise<any>;
    registerAgency(organizationName: string, name: string, email: string, address: any, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string,currency:string): Promise<any> ;
    getAgencyMenu(planId: string):Promise<any>;
    getOwner(tenantDb:any):Promise<any>
    fetchAllProjects(tenantDb:any):Promise<any>
    
}