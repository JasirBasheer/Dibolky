import { IClientTenant } from "@/models";
import { IAgencyTenant } from "../../types/agency";
import { IMetaAccount, IBucket, ISocialMediaUploadResponse } from "../../types/common";
import { IInfluncerTenant } from "../../types/influencer";
import { IBucketWithReason, INote } from "../../types/note";
import { SaveContentDto } from "@/dtos/content";
import { FilterType } from "@/utils";

export interface IProviderService {
    handleSocialMediaUploads(content: IBucket, user: IClientTenant | IAgencyTenant | IInfluncerTenant | null, isCron: boolean): Promise<ISocialMediaUploadResponse[]>;
    updateContentStatus(orgId: string, contentId: string, status: string): Promise<IBucket | null>;
    getMetaPagesDetails(orgId: string, role: string, userId: string): Promise<IMetaAccount[]>;
    getContentById(orgId: string, contentId: string): Promise<IBucket | null>;
    saveSocialMediaToken(orgId: string, platform: string, user_id: string, provider: string, accessToken: string, refreshToken?: string): Promise<void>;
    rescheduleContent(orgId: string, contentId: string,platformId:string, date: string): Promise<void>;
    rejectContent(orgId: string, content_id: string, reason: INote): Promise<void>;
    getOAuthUrl(provider:string,redirectUri:string,state?:string):Promise<string>;

    getContentDetails(orgId: string, entity: string,  userId: string, platform: string, mediaId: string, mediaType: string,pageId:string): Promise<any>
    replayToComments(orgId: string, entity: string,  userId: string, platform: string, commentId: string,pageId:string, replyMessage: string, ): Promise<any>
    deleteComment(orgId:string, userId: string, entity:string,pageId:string, platform: string, commentId: string, ): Promise<{success:boolean}>
    hideComment(orgId:string, userId: string, entity:string,pageId:string, platform: string, commentId: string ): Promise<{success:boolean}>
    saveContent(payload: SaveContentDto): Promise<IBucket>;
    fetchContents(orgId: string, role: string, userId: string, query:FilterType): Promise<{ contents: IBucketWithReason[]; totalCount: number; totalPages: number }>
    getScheduledContent(orgId: string, user_id: string): Promise<IBucket[]>
    getConnections(orgId: string, entity: string, user_id: string,includes: string): Promise<{
        validConnections: { platform: string; is_valid: boolean; connectedAt: string | undefined }[];
        connectedPages: { name: string; id: string }[];
        adAccounts: { name: string; id: string; act: string }[] }>
}