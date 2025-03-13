import { IAdmin } from "../../types/admin.types";
import { IAgency } from "../../types/agency.types";

export interface IAuthenticationService {
    resetPassword(email: string, role: string): Promise<boolean | null>;
    changePassword(token:string,password:string):Promise<IAgency | IAdmin>;
}