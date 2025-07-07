import { IAdmin, IPlan, planDetails } from "../../types/admin";

export interface IAdminService {
  adminLoginHandler(email: string, password: string): Promise<string>;
  verifyAdmin(admin_id: string): Promise<IAdmin>;
  getAllPlans(): Promise<object>;
  getPlan(plans: object, plan_id: string, platform: string): Promise<IPlan | null>;
  getRecentClients(): Promise<object>;
  getClient(client_id: string, role: string): Promise<object>;
  getAllClients(): Promise<object | null>;

  //plan-management
  createPlan(details: planDetails): Promise<void>
  editPlan(entity: string, details: planDetails): Promise<void>
  changePlanStatus(entity: string, plan_id: string): Promise<void>
  getPlanDetails(entity: string, plan_id: string): Promise<object>

}



