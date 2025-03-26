import { IAgencyTenant } from "../../types/agency.types";
import { IClientTenant } from "../../types/client.types";
import { IMetaAccount, IBucket, ISocialMediaUploadResponse } from "../../types/common.types";
import { IInfluncerTenant } from "../../types/influencer.types";
import { INote } from "../../types/note.types";

export interface IProviderService {
    handleSocialMediaUploads(content: IBucket, user: IClientTenant | IAgencyTenant | IInfluncerTenant | null, isCron: boolean): Promise<ISocialMediaUploadResponse[]>;
    updateContentStatus(orgId: string, contentId: string, status: string): Promise<IBucket | null>;
    getMetaPagesDetails(access_token: string): Promise<IMetaAccount[]>;
    getContentById(orgId: string, contentId: string): Promise<IBucket | null>;
    saveSocialMediaToken(orgId: string, platform: string, user_id: string, provider: string, token: string): Promise<void>;
    reScheduleContent(orgId: string, content_id: string, date: string): Promise<void>;
    rejectContent(orgId: string, content_id: string, reason: INote): Promise<void>;
}