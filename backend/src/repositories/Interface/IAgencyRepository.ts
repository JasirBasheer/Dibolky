import { IBaseRepository } from "mern.common";
import { IAgency } from "../../shared/types/agency.types";
import { IPlan } from "../../shared/types/admin.types";

export interface IAgencyRepository extends IBaseRepository<IAgency> {
  findAgencyWithMail(agency_mail: string): Promise<IAgency | null>;
  findAgencyWithId(agency_id: string): Promise<IAgency | null>;
  findAgencyWithOrgId(orgId: string): Promise<IAgency | null>;
  changePassword(agency_id: string, password: string): Promise<IAgency | null>;
  getAgencyPlanConsumers(plan_id: string): Promise<IAgency[] | null> 
}




