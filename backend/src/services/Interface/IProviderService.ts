import { IClientTenant } from "@/models";
import { IAgencyTenant } from "../../types/agency";
import { IMetaAccount, IBucket, ISocialMediaUploadResponse } from "../../types/common";
import { IInfluncerTenant } from "../../types/influencer";
import { INote } from "../../types/note";

export interface IProviderService {
    handleSocialMediaUploads(content: IBucket, user: IClientTenant | IAgencyTenant | IInfluncerTenant | null, isCron: boolean): Promise<ISocialMediaUploadResponse[]>;
    updateContentStatus(orgId: string, contentId: string, status: string): Promise<IBucket | null>;
    getMetaPagesDetails(access_token: string): Promise<IMetaAccount[]>;
    getContentById(orgId: string, contentId: string): Promise<IBucket | null>;
    saveSocialMediaToken(orgId: string, platform: string, user_id: string, provider: string, accessToken: string, refreshToken?: string): Promise<void>;
    rescheduleContent(orgId: string, contentId: string,platformId:string, date: string): Promise<void>;
    rejectContent(orgId: string, content_id: string, reason: INote): Promise<void>;
    getOAuthUrl(provider:string,redirectUri:string,state?:string):Promise<string>
}