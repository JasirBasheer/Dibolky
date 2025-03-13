import { IAgencyTenant } from "../../types/agency.types";
import { IClientTenant } from "../../types/client.types";
import { IMetaAccount, IReviewBucket, ISocialMediaUploadResponse } from "../../types/common.types";
import { IInfluncerTenant } from "../../types/influencer.types";

export interface IProviderService {
    handleSocialMediaUploads(content:IReviewBucket,user:IClientTenant | IAgencyTenant | IInfluncerTenant | null,isCron:boolean):Promise<ISocialMediaUploadResponse[]>;
    updateContentStatus(orgId:string,contentId: string,status:string):Promise<IReviewBucket | null>;
    getMetaPagesDetails(access_token:string):Promise<IMetaAccount[]>;
    getContentById(orgId:string,contentId:string):Promise<IReviewBucket | null>;
    saveSocialMediaToken(orgId:string,platform:string,user_id:string,provider:string,token:string):Promise<void>;
    reScheduleContent(orgId:string,content_id:string,date:string):Promise<void>;
}