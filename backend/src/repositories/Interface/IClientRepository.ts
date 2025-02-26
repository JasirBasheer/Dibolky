import { IClient } from "../../shared/types/client.types";

export interface IClientRepository {
  findClientWithMail(email: string): Promise<IClient | null>;
  findClientWithId(id: string): Promise<IClient | null>;
  createClient(newClient: any): Promise<IClient | null>;
  
}
