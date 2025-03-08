import { IBaseRepository } from "mern.common";
import { IClientTenant, User } from "../../shared/types/client.types";
import { IUpdateProfile } from "../../shared/types/common.types";

export interface IClientTenantRepository  {
  createClient(orgId: string, details: Partial<IClientTenant>): Promise<IClientTenant>;
  getAllClients(orgId: string): Promise<IClientTenant[]>;
  getClientById(orgId: string, client_id: string): Promise<IClientTenant | null>;
  setSocialMediaTokens(orgId: string, client_id: string, provider: string, token: string): Promise<void>;
  getClientDetailsByMail(orgId:string, email: string): Promise<IClientTenant | null>;
  getOwnerDetails(orgId: string): Promise<IClientTenant[] | null>
  updateProfile(orgId:string,details:IUpdateProfile): Promise<IClientTenant | null >
}
