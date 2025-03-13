import { IProject } from "../../models/project.model";
import { IPlan } from "../../types/admin.types";
import { AddressType, IAgency, IAgencyTenant } from "../../types/agency.types";
import { IClientTenant } from "../../types/client.types";
import { IFiles, IIntegratePaymentType, IMenuCategory, IMetadata, IPlatforms, IBucket, IUpdateProfile } from "../../types/common.types";
import { IInfluencer } from "../../types/influencer.types";

export interface IEntityService {
    getAllPlans(): Promise<Record<string, IPlan[]>>;
    getPlan(plans: Record<string, IPlan[]>, plan_id: string, platform: string): Promise<Partial<IPlan>>;
    fetchAllProjects(orgId: string, page?:number): Promise<{projects:IProject[],totalPages:number} | null>;
    IsMailExists(mail: string, platform: string): Promise<boolean | null>;
    registerAgency(organizationName: string, name: string, email: string, address: AddressType, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string, currency: string): Promise<Partial<IAgency> | null>;
    createInfluencer(organizationName: string, name: string, email: string, address: AddressType, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string, currency: string): Promise<Partial<IInfluencer> | null>;
    getAgencyMenu(planId: string): Promise<IMenuCategory>;
    getClientMenu(orgId: string, client_id: string): Promise<IMenuCategory>;
    getOwner(orgId: string): Promise<IAgencyTenant[]>
    saveContent(orgId: string, platform: string, platforms: IPlatforms[], user_id: string, files: IFiles[], metadata: IMetadata, contentType: string): Promise<IBucket>;
    getS3ViewUrl(key: string): Promise<string>
    fetchContents(orgId: string, user_id: string): Promise<IBucket[]>
    updateProfile(orgId: string,role: string,requestRole:string,details: IUpdateProfile): Promise<IAgencyTenant | IClientTenant>
    getScheduledContent(orgId:string, user_id: string):Promise<IBucket[]>
    getConnections(orgId:string ,entity:string, user_id:string):Promise<object[]>
}