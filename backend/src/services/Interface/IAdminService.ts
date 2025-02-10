import { planDetails } from "../../shared/types/admin.types";

export interface IAdminService {
    adminLoginHandler(email: string, password: string): Promise<any>;
    verifyAdmin(id: string): Promise<any>;
    getAllPlans(): Promise<any>;
    getPlan(plans: any, id: string, platform: string): Promise<any>;
    getAgencyMenu(planId: string): Promise<any>;
    getCompanyMenu(planId: string): Promise<any>;
    getRecentClients(): Promise<any>;
    getClient(id: string, role: string): Promise<any>;
    getAllClients(): Promise<any>;

    //plan-management
    createPlan(entity:string,details:planDetails):Promise<void>
    editPlan(entity:string,details:planDetails):Promise<void>
    changePlanStatus(entity:string,id:string):Promise<void>
    getPlanDetails(entity:string,id:string):Promise<void>
    
  }
  


