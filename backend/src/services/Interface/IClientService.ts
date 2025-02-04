export interface IClientService {
    clientLoginHandler(email: string, password: string): Promise<any>;
    verifyClient(id:string):Promise<any>;
    getClientDetails(tenantDb:any,email:string):Promise<any>
    saveClientSocialMediaTokens(id:string,provider:string,token:string,db?:any):Promise<any>;
    setSocialMediaUserNames(id: string, provider: string, username: string, db?: any): Promise<any>;
    getReviewBucket(clientId: string, tenantDb: any): Promise<any>
}