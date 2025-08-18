import mongoose, { SortOrder } from "mongoose";
import { IUpdateProfile } from "../../types/common";
import { IAgency } from "@/models/Interface/agency";

export interface IAgencyRepository {
  createAgency(newAgency: object,  session?: mongoose.ClientSession): Promise<Partial<IAgency>>;
  getAllAgencies(filter?: Record<string, unknown> , options?: { page?: number, limit?: number, sort?: Record<string, 1 | -1> }): Promise<{data:IAgency[] , totalCount: number}>;
  findAgencyWithMail(agency_mail: string): Promise<IAgency | null>;
  toggleAccess(agency_id:string):Promise<void>
  findAgencyWithId(agency_id: string): Promise<IAgency | null>;
  findAgencyWithOrgId(orgId: string): Promise<IAgency | null>;
  upgradePlanWithOrgId(orgId: string,planId: string,validity: Date): Promise<IAgency | null>;
  changePassword(agency_id: string, password: string): Promise<IAgency | null>;
  updateProfile(orgId: string, details: IUpdateProfile): Promise<IAgency | null>
}




