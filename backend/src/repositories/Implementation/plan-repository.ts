import { inject, injectable } from "tsyringe";
import { IPlanRepository } from "../Interface/IPlanRepository";
import { Model } from "mongoose";
import { BaseRepository } from "mern.common";
import {
  CreatePlanDto,
  EditPlanDto,
  PaginatedResponse,
  QueryDto,
} from "@/dtos";
import { PlanDoc } from "@/models";
import { QueryParser } from "@/utils";

@injectable()
export class PlanRepository
  extends BaseRepository<PlanDoc>
  implements IPlanRepository
{
  constructor(@inject("plan_model") model: Model<PlanDoc>) {
    super(model);
  }

  async getPlans(query: QueryDto): Promise<PaginatedResponse<PlanDoc>> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["name", "description", "billingCycle"],
      additionalFilters: {
        ...(query.type &&
          query.type !== "all" &&
          query.type !== "" && { type: query.type }),
      },
    });

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === "desc" ? -1 : 1};
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

  async getPlan(planId: string): Promise<PlanDoc | null> {
    return await this.findOne({ _id: planId });
  }

  async createPlan(details: CreatePlanDto): Promise<PlanDoc | null> {
    const newPlan = new this.model(details);
    return await newPlan.save();
  }


  async editPlan(_id: string, details: EditPlanDto): Promise<PlanDoc | null> {
    return await this.model.findByIdAndUpdate(_id, details, {
      new: true,
      runValidators: true,
    });
  }

  async changePlanStatus(plan_id: string): Promise<PlanDoc | null> {
    const plan = await this.findOne({ _id: plan_id });
    return await this.model.findByIdAndUpdate(
      plan_id,
      { isActive: !plan?.isActive },
      { new: true }
    );
  }
}
