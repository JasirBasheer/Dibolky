import { IReviewBucket } from "../../shared/types/agency.types";

export interface IProviderService {
    handleSocialMediaUploads(orgId:string,contentId:string,clientId:string,isCron:boolean):Promise<any>;
    updateContentStatus(orgId:string,contentId: string,status:string):Promise<IReviewBucket | null>;
    getMetaPagesDetails(access_token:string):Promise<any>;
    getContentById(orgId:string,contentId:string):Promise<IReviewBucket | null>;
}