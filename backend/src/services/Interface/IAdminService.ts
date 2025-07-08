import { IAdmin, IPlan } from "../../types/admin";

export interface IAdminService {
  adminLoginHandler(email: string, password: string): Promise<string>;
  verifyAdmin(admin_id: string): Promise<IAdmin>;
  getRecentClients(): Promise<object>;
  getClient(client_id: string): Promise<object>;
  getAllClients(): Promise<object | null>;

}



