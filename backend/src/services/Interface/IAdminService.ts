import { IAgencyType } from "@/types/agency";
import { IAdminType, IPlanType } from "../../types/admin";

export interface IAdminService {
  adminLoginHandler(email: string, password: string): Promise<string>;
  verifyAdmin(admin_id: string): Promise<IAdminType>;
  getRecentClients(): Promise<Partial<IAgencyType[]>>;
  getClient(client_id: string): Promise<object>;
  getAllClients(): Promise<Partial<IAgencyType[]>>;

}



