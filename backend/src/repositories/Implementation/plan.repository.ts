import { AgencyPlan, CompanyPlan } from '../../models/admin/plan.model'
import { planDetails } from '../../shared/types/admin.types'
import { IPlanRepository } from '../Interface/IPlanRepository'

export default class PlanRepository implements IPlanRepository {
        async getCompanyPlans(): Promise<any> {
                return await CompanyPlan.find()
        }
        async getAgencyPlans(): Promise<any> {
                return await AgencyPlan.find()
        }
        async getAgencyPlan(planId: string): Promise<any> {
                return await AgencyPlan.findOne({ _id: planId })
        }
        async getCompanyPlan(planId: string): Promise<any> {
                return await CompanyPlan.findOne({ _id: planId })
        }
        async createAgencyPlan(details: planDetails): Promise<any> {
                const newPlan = new AgencyPlan(details);
                return await newPlan.save();
        }
        async createCompanyPlan(details: planDetails): Promise<any> {
                const newPlan = new CompanyPlan(details);
                return await newPlan.save();
        }
        async editAgencyPlan(details: planDetails): Promise<any> {
                const { _id, ...updateData } = details;
                return await AgencyPlan.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        }

        async editCompanyPlan(details: planDetails): Promise<any> {
                const { _id, ...updateData } = details;
                return await CompanyPlan.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
    
        }

}