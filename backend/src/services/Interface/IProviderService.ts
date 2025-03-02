import { IAgencyTenant } from "../../shared/types/agency.types";
import { IClientTenant } from "../../shared/types/client.types";
import { IMetaAccount, IReviewBucket, ISocialMediaUploadResponse } from "../../shared/types/common.types";
import { IInfluncerTenant } from "../../shared/types/influencer.types";

export interface IProviderService {
    handleSocialMediaUploads(content:IReviewBucket,user:IClientTenant | IAgencyTenant | IInfluncerTenant | null,isCron:boolean):Promise<ISocialMediaUploadResponse[]>;
    updateContentStatus(orgId:string,contentId: string,status:string):Promise<IReviewBucket | null>;
    getMetaPagesDetails(access_token:string):Promise<IMetaAccount[]>;
    getContentById(orgId:string,contentId:string):Promise<IReviewBucket | null>;
    saveSocialMediaToken(orgId:string,platform:string,user_id:string,provider:string,token:string):Promise<void>;
}