import { IClientType } from "@/types/client";
import { IAdminType } from "../../types/admin";
import { IAgencyType } from "../../types/agency";

export interface IAuthenticationService {
    resetPassword(email: string, role: string): Promise<boolean | null>;
    changePassword(token:string,password:string):Promise<IAgencyType | IAdminType | IClientType>;
}