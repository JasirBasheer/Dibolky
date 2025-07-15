import { IAgencyRegistrationDto } from "@/dto";
import { IProject } from "../../models/Implementation/project";
import {  IAgencyType, IAgencyTenant } from "../../types/agency";
import { IMenu, IBucket, IUpdateProfile } from "../../types/common";
import { SaveContentDto } from "@/dto/content";
import { IClientTenant } from "@/models";

export interface IEntityService {
    fetchAllProjects(orgId: string, page?: number): Promise<{ projects: IProject[], totalPages: number } | null>;
    IsMailExists(mail: string): Promise<boolean>;
    createAgency(payload: IAgencyRegistrationDto): Promise<Partial<IAgencyType> | null>;
    getMenu(planId: string): Promise<IMenu[]>;
    getClientMenu(orgId: string, client_id: string): Promise<IMenu[]>;
    getOwner(orgId: string): Promise<IAgencyTenant[]>
    saveContent(payload: SaveContentDto): Promise<IBucket>;
    getS3ViewUrl(key: string): Promise<string>
    fetchContents(orgId: string, user_id: string): Promise<IBucket[]>
    updateProfile(orgId: string, role: string, requestRole: string, details: IUpdateProfile): Promise<IAgencyTenant | IClientTenant>
    getScheduledContent(orgId: string, user_id: string): Promise<IBucket[]>
    getConnections(orgId: string, entity: string, user_id: string): Promise<any>
    getInbox(orgId: string, entity: string,  userId: string, selectedPlatforms: string[], selectedPages: string[]): Promise<any>
}