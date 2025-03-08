import { IClient } from "../../shared/types/client.types";
import { IUpdateProfile } from "../../shared/types/common.types";

export interface IClientRepository {
  findClientWithMail(email: string): Promise<IClient | null>;
  findClientWithId(client_id: string): Promise<IClient | null>;
  createClient(newClient: IClient): Promise<IClient | null>;
  updateProfile(details:IUpdateProfile):Promise<IClient | null>;
  
}
