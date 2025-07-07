import { IClient } from "../../types/client";
import { IUpdateProfile } from "../../types/common";

export interface IClientRepository {
  findClientWithMail(client_mail: string): Promise<IClient | null>;
  findClientWithId(client_id: string): Promise<IClient | null>;
  createClient(newClient: IClient): Promise<IClient | null>;
  updateProfile(details: IUpdateProfile): Promise<IClient | null>;
  changePassword(client_id: string, password: string): Promise<IClient | null>;


}
