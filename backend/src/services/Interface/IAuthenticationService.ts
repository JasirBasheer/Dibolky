export interface IAuthenticationService {
    resetPassword(email: string, role: string): Promise<any>;
    changePassword(token:string,password:string):Promise<any>;
}