import { IAgencyRepository } from "../Interface/IAgencyRepository";
import { BaseRepository, NotFoundError } from "mern.common";
import mongoose, { Model, SortOrder } from "mongoose";
import { inject, injectable } from "tsyringe";
import agencyModel from "../../models/Implementation/agency";
import { IUpdateProfile } from "../../types/common";
import { IAgency } from "@/models/Interface/agency";
import { QueryParser } from "@/utils";
import { PaginatedResponse, QueryDto } from "@/dtos";

@injectable()
export class AgencyRepository
  extends BaseRepository<IAgency>
  implements IAgencyRepository
{
  constructor(@inject("agency_model") model: Model<IAgency>) {
    super(model);
  }

  async createAgency(
    new_agency: object,
    session?: mongoose.ClientSession
  ): Promise<Partial<IAgency>> {
    const agency = new this.model(new_agency);
    return await agency.save({ session });
  }

  async findAgencyWithMail(agency_mail: string): Promise<IAgency | null> {
    return this.findOne({ email: agency_mail });
  }

  async toggleAccess(agency_id: string): Promise<void> {
    const agency = await this.findOne({ _id: agency_id });
    if (!agency) throw new Error("Client not found");

    await this.update({ _id: agency_id }, { isBlocked: !agency.isBlocked });
  }

  async findAgencyWithId(agency_id: string): Promise<IAgency | null> {
    return this.findOne({ _id: agency_id });
  }

  async findAgencyWithOrgId(orgId: string): Promise<IAgency | null> {
    return this.findOne({ orgId });
  }

  async upgradePlanWithOrgId(
    orgId: string,
    planId: string,
    validity: Date
  ): Promise<IAgency | null> {
    return await this.update({ orgId }, { planId, validity });
  }

  async changePassword(
    agency_id: string,
    password: string
  ): Promise<IAgency | null> {
    return this.update(
      { _id: agency_id },
      { $set: { password } },
      { new: true }
    );
  }

  async getAllAgencies(query: QueryDto): Promise<PaginatedResponse<IAgency>> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["name", "email", "organizationName"],
    });
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    };
    const totalCount = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const mongoQuery = this.model
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const data = await mongoQuery.exec();
    return { data, page, totalCount, totalPages };
  }

  async updateProfile(
    orgId: string,
    details: IUpdateProfile
  ): Promise<IAgency | null> {
    return await this.update(
      { orgId: orgId },
      {
        profile: details.profile,
        name: details.name,
        bio: details.bio,
      },
      { new: true }
    );
  }

    async decreaseProjectCount(
    orgId: string,
  ): Promise<void> {
    await this.update(
      { orgId: orgId },
      { $inc: { remainingProjects: -1 } },
    );
  }
  async decreaseClientCount(
    orgId: string,
  ): Promise<void> {
     await this.update(
      { orgId: orgId },
      { $inc: { remainingClients: -1 } },
    );
  }
}
