import { IClientTenant } from "@/models";
import { IUpdateProfile } from "../../types/common";

export interface IClientTenantRepository  {
  createClient(orgId: string, details: Partial<IClientTenant>): Promise<IClientTenant>;
  getAllClients(orgId: string, filter?: Record<string, unknown> , options?: { page?: number, limit?: number, sort?: any }): Promise<{ data: IClientTenant[]; totalCount: number }>;
  getClientById(orgId: string, client_id: string): Promise<IClientTenant | null>;
  setSocialMediaTokens(orgId: string, client_id: string, provider: string, token: string): Promise<void>;
  getClientDetailsByMail(orgId:string, email: string): Promise<IClientTenant | null>;
  getOwnerDetails(orgId: string): Promise<IClientTenant[] | null>
  updateProfile(orgId:string,details:IUpdateProfile): Promise<IClientTenant | null >
}
