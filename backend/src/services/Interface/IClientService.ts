export interface IClientService {
    clientLoginHandler(email: string, password: string): Promise<any>;
    verifyClient(id:string):Promise<any>;
    saveClientSocialMediaTokens(id:string,provider:string,token:string,db?:any):Promise<any>;
}