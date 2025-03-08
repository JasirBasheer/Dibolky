import { IAgency } from "../../shared/types/agency.types";
import { IPlan } from "../../shared/types/admin.types";
import { IUpdateProfile } from "../../shared/types/common.types";

export interface IAgencyRepository {
  findAgencyWithMail(agency_mail: string): Promise<IAgency | null>;
  findAgencyWithId(agency_id: string): Promise<IAgency | null>;
  findAgencyWithOrgId(orgId: string): Promise<IAgency | null>;
  changePassword(agency_id: string, password: string): Promise<IAgency | null>;
  getAgencyPlanConsumers(plan_id: string): Promise<IAgency[] | null>
  updateProfile(orgId: string, details: IUpdateProfile): Promise<IAgency | null>
}




