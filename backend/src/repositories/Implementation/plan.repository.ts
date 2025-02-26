import { inject, injectable } from 'tsyringe';
import { AgencyPlan, InfluencerPlan, } from '../../models/admin/plan.model'
import { IPlan, planDetails } from '../../shared/types/admin.types'
import { IPlanRepository } from '../Interface/IPlanRepository'
import { Model } from 'mongoose';
import { BaseRepository } from 'mern.common';

@injectable()
export default class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
        constructor(
                @inject('plan_model') model: Model<IPlan>
        ) {
                super(model);
        }

        async getAgencyPlans()
                : Promise<IPlan[] | null> {
                return await this.find({})
        }

        async getAgencyPlan(
                planId: string
        ): Promise<IPlan | null> {
                return await AgencyPlan.findOne({ _id: planId }).lean();
        }

        async getInfluencerPlans()
                : Promise<IPlan[] | null> {
                return await InfluencerPlan.find({})
        }

        async getInfluencerPlan(
                planId: string
        ): Promise<IPlan | null> {
                return await InfluencerPlan.findOne({ _id: planId }).lean();
        }



        async createAgencyPlan(
                details: planDetails
        ): Promise<Partial<IPlan> | null> {
                const newPlan = new AgencyPlan(details);
                return await newPlan.save();
        }

        async createInfluencerPlan(
                details: planDetails
        ): Promise<Partial<IPlan> | null> {
                const newPlan = new InfluencerPlan(details);
                return await newPlan.save();
        }


        async editAgencyPlan(
                details: planDetails
        ): Promise<IPlan | null> {
                const { _id, ...updateData } = details;
                return await AgencyPlan.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        }


        async changeAgencyPlanStatus(
                plan_id: string
        ): Promise<IPlan | null> {
                const plan = await this.findOne({ _id: plan_id })
                return await AgencyPlan.findByIdAndUpdate(plan_id, { isActive: !plan?.isActive }, { new: true });
        }



}