import { IProject } from "../../models/Implementation/project";
import {  IAgencyType, IAgencyTenant } from "../../types/agency";
import { IMenu, IBucket, IUpdateProfile } from "../../types/common";
import { SaveContentDto } from "@/dtos/content";
import { IClientTenant } from "@/models";
import { FilterType } from "@/types/invoice";
import { IBucketWithReason, MappedProjectType } from "@/types";

export interface IEntityService {
    fetchAllProjects(orgId: string,userId:string, role:string ,query:FilterType): Promise<{ projects: MappedProjectType[]; totalPages: number } | null>;
    markProjectAsCompleted(orgId: string, projectId: string): Promise<void>;
    getMenu(planId: string): Promise<IMenu[]>;
    getClientMenu(orgId: string, client_id: string): Promise<IMenu[]>;
    getAllInvoices(orgId: string,role: string, user_id: string,query:FilterType): Promise<any>;
    getAllTransactions(orgId: string,role: string, user_id: string, query:FilterType): Promise<any>;
    getAllActivities(orgId: string,entity:string, user_id: string): Promise<any>;
    getOwner(orgId: string): Promise<IAgencyTenant[]>
    saveContent(payload: SaveContentDto): Promise<IBucket>;
    getS3ViewUrl(key: string): Promise<string>
    fetchContents(orgId: string, role: string, userId: string, query:FilterType): Promise<{ contents: IBucketWithReason[]; totalCount: number; totalPages: number }>
    updateProfile(orgId: string, role: string, requestRole: string, details: IUpdateProfile): Promise<IAgencyTenant | IClientTenant>
    getScheduledContent(orgId: string, user_id: string): Promise<IBucket[]>
    getConnections(orgId: string, entity: string, user_id: string,includes: string): Promise<{
          validConnections: { platform: string; is_valid: boolean; connectedAt: string | undefined }[];
          connectedPages: { name: string; id: string }[];
          adAccounts: { name: string; id: string; act: string }[] }>

    getInbox(orgId: string, entity: string,  userId: string, selectedPlatforms: string[], selectedPages: string[]): Promise<any>
    getMedia(orgId: string, entity: string,  userId: string, selectedPlatforms: string[], selectedPages: string[]): Promise<any>
    getContentDetails(orgId: string, entity: string,  userId: string, platform: string, mediaId: string, mediaType: string,pageId:string): Promise<any>
    replayToComments(orgId: string, entity: string,  userId: string, platform: string, commentId: string,pageId:string, replyMessage: string, ): Promise<any>
    deleteComment(orgId:string, userId: string, entity:string,pageId:string, platform: string, commentId: string, ): Promise<{success:boolean}>
    hideComment(orgId:string, userId: string, entity:string,pageId:string, platform: string, commentId: string ): Promise<{success:boolean}>
    getInboxMessages(orgId: string,  userId: string, platform: string, conversationId: string): Promise<any>
    getAgoraTokens(userId: string, channelName?: string): Promise<{rtmToken:string, rtcToken:string}>

    getAllCampaigns(orgId: string, role: string, userId: string, selectedPlatforms: string[], selectedAdAccounts: string[]): Promise<any>
    getAllAdSets(orgId: string, role: string, userId: string, id:string,platform: string): Promise<any>
    getAllAds(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<any>

    createAd(orgId: string, role: string, userId: string, adsetId:string,platform: string): Promise<any>

    getCalenderEvents(orgId: string, role: string, userId: string): Promise<any>
}