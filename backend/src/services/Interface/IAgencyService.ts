import { IProject } from "../../models/agency/project.model";
import { IAgency, IAgencyTenant } from "../../types/agency.types";
import { IAvailableClients, ServicesData } from "../../types/chat.types";
import { IClientTenant } from "../../types/client.types";
import { IFiles, IIntegratePaymentType, IPlatforms, IReviewBucket } from "../../types/common.types";

export interface IAgencyService {
    verifyOwner(agency_id: string): Promise<IAgency | null>;
    getAgencyOwnerDetails(orgId: string): Promise<IAgencyTenant | null>;
    agencyLoginHandler(email: string, password: string): Promise<string>;
    getProjectsCount(orgId: string): Promise<object>
    getClientsCount(orgId: string): Promise<object>
    getAllAvailableClients(orgId: string): Promise<IAvailableClients[]>
    createClient(orgId: string, name: string, email: string, industry: string, services: ServicesData, menu: string[], organizationName: string): Promise<IClientTenant | null>;
    getAllClients(orgId: string): Promise<IClientTenant[] | null>
    getClient(orgId: string, client_id: string): Promise<IClientTenant | null>
    saveContentToDb(client_id: string, orgId: string, files: IFiles[], platforms: IPlatforms[], contentType: string, caption: string): Promise<IReviewBucket | null>
    getContent(orgId: string, contentId: string): Promise<IReviewBucket | null>
    changeContentStatus(orgId: string, contentId: string, status: string): Promise<IReviewBucket | null>
    editProjectStatus(orgId: string, projectId: string, status: string): Promise<IProject | null>
    getInitialSetUp(orgId: string): Promise<object>;
    integratePaymentGateWay(orgId: string, provider: string, details: IIntegratePaymentType): Promise<IAgencyTenant>;
    getPaymentIntegrationStatus(orgId: string): Promise<Record<string, boolean>>;
}