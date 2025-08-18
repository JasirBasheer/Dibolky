import { inject, injectable } from "tsyringe";
import { IPlanRepository } from "../Interface/IPlanRepository";
import { Model } from "mongoose";
import { BaseRepository } from "mern.common";
import { PlanDetailsDTO } from "@/dto";
import { IPlan } from "@/models/Interface/plan";
import { IPlanType } from "@/types";

@injectable()
export class PlanRepository
  extends BaseRepository<IPlan>
  implements IPlanRepository
{
  constructor(@inject("plan_model") model: Model<IPlan>) {
    super(model);
  }

  async getPlans(
    filter: Record<string, unknown> = {},
    options?: { page?: number; limit?: number; sort?: any }
  ): Promise<{ data: IPlan[]; totalCount: number }> {
    const { page, limit, sort } = options || {};
    const totalCount = await this.model.countDocuments(filter);

    let query = this.model.find(filter);
    if (sort) query = query.sort(sort);

    if (limit && limit > 0) {
      const skip = page && page > 0 ? (page - 1) * limit : 0;
      query = query.skip(skip).limit(limit);
    }

    const data = await query.exec();

    return { data, totalCount };
  }

  async getPlan(planId: string): Promise<IPlan | null> {
    return await this.findOne({ _id: planId });
  }

  async createPlan(details: PlanDetailsDTO): Promise<Partial<IPlan> | null> {
    const newPlan = new this.model(details);
    return await newPlan.save();
  }

  async createInfluencerPlan(details: any): Promise<Partial<IPlan> | null> {
    const newPlan = new this.model(details);
    return await newPlan.save();
  }

  async editPlan(_id: string, details: PlanDetailsDTO): Promise<IPlan | null> {
    return await this.model.findByIdAndUpdate(_id, details, {
      new: true,
      runValidators: true,
    });
  }

  async changePlanStatus(plan_id: string): Promise<IPlan | null> {
    const plan = await this.findOne({ _id: plan_id });
    return await this.model.findByIdAndUpdate(
      plan_id,
      { isActive: !plan?.isActive },
      { new: true }
    );
  }
}
