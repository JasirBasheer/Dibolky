import { IProject } from "../../models/agency/project.model";
import { IPlan } from "../../shared/types/admin.types";
import { AddressType, IAgency, IAgencyTenant } from "../../shared/types/agency.types";
import { IFiles, IMenuCategory, IMetadata, IPlatforms, IReviewBucket } from "../../shared/types/common.types";
import { IInfluencer } from "../../shared/types/influencer.types";

export interface IEntityService {
    getAllPlans(): Promise<Record<string,IPlan[]> >;
    getPlan(plans: Record<string,IPlan[]>, plan_id: string, platform: string): Promise<Partial<IPlan>>;
    fetchAllProjects(orgId:string):Promise<Partial<IProject[]> | null>;
    IsMailExists(mail: string, platform: string): Promise<boolean | null>;
    registerAgency(organizationName: string, name: string, email: string, address: AddressType, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string,currency:string): Promise<Partial<IAgency> | null> ;
    createInfluencer(organizationName: string, name: string, email: string, address: AddressType, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string,currency:string): Promise<Partial<IInfluencer> | null> ;
    getAgencyMenu(planId: string):Promise<IMenuCategory>;
    getClientMenu(orgId:string,client_id:string):Promise<IMenuCategory>;
    getOwner(orgId:string):Promise<IAgencyTenant[]>   
    saveContent(orgId:string,platform:string,platforms:IPlatforms[],user_id:string,files:IFiles[],metadata:IMetadata,contentType:string):Promise<IReviewBucket>;
    getS3ViewUrl(key:string):Promise<string>
    fetchContents(orgId: string,user_id: string): Promise<IReviewBucket[]>
}