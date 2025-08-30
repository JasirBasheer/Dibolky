import {  IAgencyTenant } from "../../types/agency";
import { IMenu, IUpdateProfile } from "../../types/common";
import { IActivity, IClientTenant, IInvoice, TransactionDoc } from "@/models";
import { FilterType } from "@/types/invoice";
import { ISocialUserType, MappedProjectType } from "@/types";

export interface IEntityService {
    fetchAllProjects(orgId: string,userId:string, role:string ,query:FilterType): Promise<{ projects: MappedProjectType[]; totalPages: number } | null>;
    markProjectAsCompleted(orgId: string, projectId: string): Promise<void>;
    getMenu(planId: string): Promise<IMenu[]>;
    getClientMenu(orgId: string, client_id: string): Promise<IMenu[]>;
    getAllInvoices(orgId: string,role: string, user_id: string,query:FilterType): Promise<{ invoices: IInvoice[]; totalCount: number; totalPages: number }>;
    getAllTransactions(orgId: string,role: string, user_id: string, query:FilterType): Promise<{ transactions: TransactionDoc[], totalCount: number ,totalPages: number }>;
    getAllActivities(orgId: string,entity:string, user_id: string): Promise<IActivity[]>;
    getOwner(orgId: string): Promise<IAgencyTenant[]>
    updateProfile(orgId: string, role: string, requestRole: string, details: IUpdateProfile): Promise<IAgencyTenant | IClientTenant>
    getInbox(orgId: string, entity: string,  userId: string, selectedPlatforms: string[], selectedPages: string[]): Promise<ISocialUserType[]>
    getMedia(orgId: string, entity: string,  userId: string, selectedPlatforms: string[], selectedPages: string[]): Promise<object[]>
    getInboxMessages(orgId: string,  userId: string, platform: string, conversationId: string): Promise<object[]>
    getAgoraTokens(userId: string, channelName?: string): Promise<{rtmToken:string, rtcToken:string}>
    getCalenderEvents(orgId: string, role: string, userId: string): Promise<{ _id: string; title: string; from: string | Date; to: string | Date; }[]>   
}