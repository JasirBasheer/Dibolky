import { IAdminType, IPlanType } from "../../types/admin";
 
export interface IAdminService {
  adminLoginHandler(email: string, password: string): Promise<string>;
  verifyAdmin(admin_id: string): Promise<IAdminType>;
}



