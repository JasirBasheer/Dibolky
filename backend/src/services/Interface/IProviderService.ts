import { IReviewBucket } from "../../shared/types/agency.types";

export interface IProviderService {
    handleSocialMediaUploads(contentId:string,user:any,isCron:boolean):Promise<any>;
    updateContentStatus(orgId:string,contentId: string,status:string):Promise<IReviewBucket | null>;
    getMetaPagesDetails(access_token:string):Promise<any>;
    getContentById(orgId:string,contentId:string):Promise<IReviewBucket | null>;
    saveSocialMediaToken(orgId:string,platform:string,user_id:string,provider:string,token:string):Promise<void>;
}