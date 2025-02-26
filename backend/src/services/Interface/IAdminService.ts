import { IAdmin, IPlan, planDetails } from "../../shared/types/admin.types";

export interface IAdminService {
  adminLoginHandler(email: string, password: string): Promise<string>;
  verifyAdmin(admin_id: string): Promise<IAdmin>;
  getAllPlans(): Promise<object>;
  getPlan(plans: object, plan_id: string, platform: string): Promise<IPlan | null>;
  getAgencyMenu(plan_id: string): Promise<object>;
  getRecentClients(): Promise<object>;
  getClient(client_id: string, role: string): Promise<object>;
  getAllClients(): Promise<object | null>;

  //plan-management
  createPlan(entity: string, details: planDetails): Promise<void>
  editPlan(entity: string, details: planDetails): Promise<void>
  changePlanStatus(entity: string, id: string): Promise<void>
  getPlanDetails(entity: string, plan_id: string): Promise<object>

}



