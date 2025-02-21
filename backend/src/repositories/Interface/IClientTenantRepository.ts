import { IBaseRepository } from "mern.common";
import { IClientTenant, User } from "../../shared/types/client.types";

export interface IClientTenantRepository  {
  createClient(orgId: string, details: any): Promise<IClientTenant | void>;
  getAllClients(orgId: string): Promise<IClientTenant[]>;
  getClientById(orgId: string, client_id: string): Promise<IClientTenant | null>;
  setSocialMediaTokens(orgId: string, client_id: string, provider: string, token: string): Promise<void>;
  setSocialMediaUserNames(orgId: string, client_id: string, provider: string, username: string): Promise<void>;
  getClientDetailsByMail(tenantDb: any, email: string): Promise<IClientTenant | null>;
  getOwnerDetails(orgId: string): Promise<IClientTenant[] | null>
}
