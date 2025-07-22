import { IPlanType } from "../../types/admin";
import { IUpdateProfile } from "../../types/common";
import { IAgency } from "@/models/Interface/agency";

export interface IAgencyRepository {
  findAgencyWithMail(agency_mail: string): Promise<IAgency | null>;
  findAgencyWithId(agency_id: string): Promise<IAgency | null>;
  findAgencyWithOrgId(orgId: string): Promise<IAgency | null>;
  upgradePlanWithOrgId(orgId: string,planId: string,validity: Date): Promise<IAgency | null>;
  changePassword(agency_id: string, password: string): Promise<IAgency | null>;
  getAgencyPlanConsumers(plan_id: string): Promise<IAgency[] | null>
  updateProfile(orgId: string, details: IUpdateProfile): Promise<IAgency | null>
}




