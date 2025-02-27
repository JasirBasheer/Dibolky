import { IProject } from "../../models/agency/project.model";
import { IPlan } from "../../shared/types/admin.types";
import { IAgencyOwner } from "../../shared/types/agency.types";

export interface IEntityService {
    getAllPlans(): Promise<Record<string,Array<any>> | null>;
    getPlan(plans: any, plan_id: string, platform: string): Promise<Partial<IPlan> | null>;
    fetchAllProjects(orgId:string):Promise<Partial<IProject[]> | null>;
    IsMailExists(mail: string, platform: string): Promise<boolean | null>;
    registerAgency(organizationName: string, name: string, email: string, address: any, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string,currency:string): Promise<Partial<IAgencyOwner> | null> ;
    createInfluencer(organizationName: string, name: string, email: string, address: any, websiteUrl: string, industry: string,
        contactNumber: number, logo: string, password: string, planId: string, validity: number, planPurchasedRate: number,
        transactionId: string, paymentGateway: string, description: string,currency:string): Promise<Partial<IAgencyOwner> | null> ;
    getAgencyMenu(planId: string):Promise<any>;
    getClientMenu(orgId:string,client_id:string):Promise<any>;
    getOwner(orgId:string):Promise<any>   
    saveContent(orgId:string,platform:string,platforms:any,user_id:string,files:any,metadata:any,contentType:string):Promise<any>;
    getS3ViewUrl(key:string):Promise<string>
    fetchContents(orgId: string,user_id: string): Promise<any>
}