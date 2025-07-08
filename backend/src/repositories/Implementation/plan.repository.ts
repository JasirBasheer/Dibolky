import { inject, injectable } from 'tsyringe';
import { IPlanRepository } from '../Interface/IPlanRepository'
import { Model } from 'mongoose';
import { BaseRepository } from 'mern.common';
import { PlanDetailsDTO } from '@/dto';
import { IPlan } from '@/types';

@injectable()
export default class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
        constructor(
                @inject('plan_model') model: Model<IPlan>
        ) {
                super(model);
        }

        async getPlans()
                : Promise<IPlan[] | null> {
                return await this.find({})
        }

        async getTrialPlans()
                : Promise<IPlan[] | null> {
                return await this.find({price:0})
        }

        async getPlan(
                planId: string
        ): Promise<IPlan | null> {
                return await this.findOne({ _id: planId });
        }



        async createPlan(
                details: PlanDetailsDTO
        ): Promise<Partial<IPlan> | null> {
                const newPlan = new this.model(details);
                return await newPlan.save();
        }

        async createInfluencerPlan(
                details: any
        ): Promise<Partial<IPlan> | null> {
                const newPlan = new this.model(details);
                return await newPlan.save();
        }


        async editPlan(
                details: IPlan
        ): Promise<IPlan | null> {
                const { _id, ...updateData } = details;
                return await this.model.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        }


        async changePlanStatus(
                plan_id: string
        ): Promise<IPlan | null> {
                const plan = await this.findOne({ _id: plan_id })
                return await this.model.findByIdAndUpdate(plan_id, { isActive: !plan?.isActive }, { new: true });
        }



}