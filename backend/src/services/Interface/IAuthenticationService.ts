import { IAdmin } from "../../types/admin";
import { IAgency } from "../../types/agency";

export interface IAuthenticationService {
    resetPassword(email: string, role: string): Promise<boolean | null>;
    changePassword(token:string,password:string):Promise<IAgency | IAdmin>;
}