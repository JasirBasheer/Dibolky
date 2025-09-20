import {  IAgencyTenant } from "../../types/agency";
import { IMenu, IUpdateProfile } from "../../types/common";
import { IActivity, IClientTenant, IInvoice, TransactionDoc } from "@/models";
import { FilterType } from "@/types/invoice";
import { ISocialUserType, MappedProjectType } from "@/types";

export interface IEntityService {
    getAllInvoices(orgId: string,role: string, user_id: string,query:FilterType): Promise<{ invoices: IInvoice[]; totalCount: number; totalPages: number }>;
    getAllTransactions(orgId: string,role: string, user_id: string, query:FilterType): Promise<{ transactions: TransactionDoc[], totalCount: number ,totalPages: number }>;
    getAllActivities(orgId: string,entity:string, user_id: string): Promise<IActivity[]>;
    updateProfile(orgId: string, role: string, requestRole: string, details: IUpdateProfile): Promise<IAgencyTenant | IClientTenant>
    getMedia(orgId: string, entity: string,  userId: string, selectedPlatforms: string[], selectedPages: string[]): Promise<object[]>
    getCalenderEvents(orgId: string, role: string, userId: string): Promise<{ _id: string; title: string; from: string | Date; to: string | Date; }[]>   
}