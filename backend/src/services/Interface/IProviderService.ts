export interface IProviderService {
    handleSocialMediaUploads(tenantDb:any,contentId:string,clientId:string,isCron:boolean):Promise<any>;
    updateContentStatus(tenantDb:any,content: any,status:string):Promise<any>;
    getContentById(contentId:any, db:any):Promise<any>;
}