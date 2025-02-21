import { ITransaction } from "../../models/admin/transaction.model";
import { IAgency } from "../../shared/types/agency.types";

export interface IEntityRepository {
    createAgency(newAgency: Partial<IAgency>): Promise<IAgency | null>;
    isAgencyMailExists(email: string): Promise<IAgency | null>;
    saveDetailsInAgencyDb(agency_id: string, orgId: string): Promise<any>;
    getAllAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    getAllRecentAgencyOwners(): Promise<Partial<IAgency[]> | null>;
    fetchOwnerDetails(tenantDb: any): Promise<any>;
    fetchAllProjects(projectsModel: any): Promise<any>
}