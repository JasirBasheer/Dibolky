import { IProject } from "../../models/Implementation/project";
import { IAgencyType, IAgencyTenant } from "../../types/agency";
import { IAvailableClients, ServicesData } from "../../types/chat";
import { IClientTenantType, IClientTenantWithProjectDetailsType } from "../../types/client";
import { IClientTenant } from "@/models";
import { IFiles, IIntegratePaymentType, IPlatforms, IBucket } from "../../types/common";
import { IInvoiceType } from "@/types/invoice";
import { FilterType } from "@/utils";
import { IAgencyRegistrationDto } from "@/dto";

export interface IAgencyService {
    verifyOwner(agency_id: string): Promise<Partial<IAgencyType> | null>;
    createAgency(payload: IAgencyRegistrationDto): Promise<Partial<IAgencyType> | null>;
    IsMailExists(mail: string): Promise<boolean>;
  
    getAgencyOwnerDetails(orgId: string): Promise<IAgencyTenant | null>;
    agencyLoginHandler(email: string, password: string): Promise<string>;
    toggleAccess(client_id: string): Promise<void>;
    getProjects(orgId: string,projectsFor:string): Promise<object>
    getAllAvailableClients(orgId: string): Promise<IAvailableClients[]>
    createClient(orgId: string, name: string, email: string, industry: string, services: ServicesData, menu: string[], organizationName: string): Promise<IClientTenant | null>;
    getAllClients(orgId: string, includeDetails:string,query:FilterType): Promise<{  clients: IClientTenantType[] | IClientTenantWithProjectDetailsType[]| { count: number; lastWeekCount: number };totalPages?: number;currentPage?: number;totalCount?: number;}>
    getClient(orgId: string, client_id: string): Promise<IClientTenant | null>
    saveContentToDb(client_id: string, orgId: string, files: IFiles[], platforms: IPlatforms[], contentType: string, caption: string): Promise<IBucket | null>
    getContent(orgId: string, contentId: string): Promise<IBucket | null>
    changeContentStatus(orgId: string, contentId: string, status: string): Promise<IBucket | null>
    editProjectStatus(orgId: string, projectId: string, status: string): Promise<IProject | null>
    getInitialSetUp(orgId: string): Promise<object>;
    integratePaymentGateWay(orgId: string, provider: string, details: IIntegratePaymentType): Promise<IAgencyTenant>;
    getPaymentIntegrationStatus(orgId: string): Promise<Record<string, boolean>>;
    createInvoice(orgId:string,details:Partial<IInvoiceType>): Promise<void>
    getUpgradablePlans(orgId:string): Promise<any>
    upgradePlan(orgId:string, planId:string): Promise<void>
    sendMail(orgId:string, to:string[],subject:string,messages:string): Promise<void>
    
}