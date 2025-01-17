export interface IAdminService {
    adminLoginHandler(email: string, password: string): Promise<any>;
    verifyAdmin(email: string): Promise<any>;
    getAllPlans(): Promise<any>;
    getPlan(plans: any, id: string, platform: string): Promise<any>;
    getAgencyMenu(planId: string): Promise<any>;
    getCompanyMenu(planId: string): Promise<any>;
    getRecentClients(): Promise<any>;
    getClient(id: string, role: string): Promise<any>;
    getAllClients(): Promise<any>;
  }
  