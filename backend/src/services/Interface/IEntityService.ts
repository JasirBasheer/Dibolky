import { IProject } from "../../models/project";
import { IPlan } from "../../types/admin";
import { AddressType, IAgency, IAgencyRegistrationPayload, IAgencyTenant } from "../../types/agency";
import { IClientTenant } from "../../types/client";
import { IFiles, IIntegratePaymentType, IMenuCategory, IMetadata, IPlatforms, IBucket, IUpdateProfile } from "../../types/common";
import { IInfluencer, IInfluncerRegisterPayload } from "../../types/influencer";

export interface IEntityService {
    getAllPlans(): Promise<Record<string, IPlan[]>>;
    getAllTrailPlans(): Promise<IPlan[]>;
    getPlan(plan_id: string): Promise<IPlan | null>;
    fetchAllProjects(orgId: string, page?: number): Promise<{ projects: IProject[], totalPages: number } | null>;
    IsMailExists(mail: string, platform: string): Promise<boolean>;
    registerAgency(payload: IAgencyRegistrationPayload): Promise<Partial<IAgency> | null>;
    createInfluencer(payload :IInfluncerRegisterPayload): Promise<Partial<IInfluencer> | null>;
    getMenu(planId: string): Promise<IMenuCategory>;
    getClientMenu(orgId: string, client_id: string): Promise<IMenuCategory>;
    getOwner(orgId: string): Promise<IAgencyTenant[]>
    saveContent(orgId: string, platform: string, platforms: IPlatforms[], user_id: string, files: IFiles[], metadata: IMetadata, contentType: string): Promise<IBucket>;
    getS3ViewUrl(key: string): Promise<string>
    fetchContents(orgId: string, user_id: string): Promise<IBucket[]>
    updateProfile(orgId: string, role: string, requestRole: string, details: IUpdateProfile): Promise<IAgencyTenant | IClientTenant>
    getScheduledContent(orgId: string, user_id: string): Promise<IBucket[]>
    getConnections(orgId: string, entity: string, user_id: string): Promise<object[]>
}