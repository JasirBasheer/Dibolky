export interface IProviderService {
    handleSocialMediaUploads(tenantDb:any,contentId:string,clientId:string):Promise<any>;
    updateContentStatus(tenantDb:any,contentId:string,status:string):Promise<any>;
}