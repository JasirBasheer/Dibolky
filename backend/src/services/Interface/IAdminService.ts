import { IAgencyType } from "@/types/agency";
import { IAdminType, IPlanType } from "../../types/admin";
import { FilterType } from "@/utils";
import { ITransaction } from "@/models";

export interface IAdminService {
  adminLoginHandler(email: string, password: string): Promise<string>;
  verifyAdmin(admin_id: string): Promise<IAdminType>;
  getClient(client_id: string): Promise<object>;
  getAllClients(query:FilterType): Promise<{ clients:IAgencyType[], totalCount: number }>;
  getTransactions(query:FilterType): Promise<{ transactions:ITransaction[], totalCount: number }>;
}



