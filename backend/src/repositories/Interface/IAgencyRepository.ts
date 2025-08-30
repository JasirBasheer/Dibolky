import mongoose, { SortOrder } from "mongoose";
import { IUpdateProfile } from "../../types/common";
import { IAgency } from "@/models/Interface/agency";
import { PaginatedResponse, QueryDto } from "@/dtos";

export interface IAgencyRepository {
  createAgency(newAgency: object,  session?: mongoose.ClientSession): Promise<Partial<IAgency>>;
  getAllAgencies(query: QueryDto): Promise<PaginatedResponse<IAgency>>;
  findAgencyWithMail(agency_mail: string): Promise<IAgency | null>;
  toggleAccess(agency_id:string):Promise<void>
  findAgencyWithId(agency_id: string): Promise<IAgency | null>;
  findAgencyWithOrgId(orgId: string): Promise<IAgency | null>;
  upgradePlanWithOrgId(orgId: string,planId: string,validity: Date): Promise<IAgency | null>;
  changePassword(agency_id: string, password: string): Promise<IAgency | null>;
  updateProfile(orgId: string, details: IUpdateProfile): Promise<IAgency | null>
  decreaseProjectCount(orgId: string): Promise<void>;
  decreaseClientCount(orgId: string): Promise<void>;
}




