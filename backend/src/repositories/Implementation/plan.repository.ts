import { AgencyPlan, CompanyPlan } from '../../models/admin/plan.model'
import agencyModel from '../../models/agency/agency.model'
import companyModel from '../../models/company/company.model'
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
                return await AgencyPlan.findOne({ _id: planId }).lean();
        }
        async getCompanyPlan(planId: string): Promise<any> {
                return await CompanyPlan.findOne({ _id: planId }).lean();
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
        async changeAgencyPlanStatus(id: string): Promise<any> {
                const plan = await AgencyPlan.findOne({_id:id})
                return await AgencyPlan.findByIdAndUpdate(id, { isActive: !plan?.isActive }, { new: true });
        }

        async changeCompanyPlanStatus(id: string): Promise<any> {
                const plan = await CompanyPlan.findOne({_id:id})
                console.log(plan)
                return await CompanyPlan.findByIdAndUpdate(id, { isActive: !plan?.isActive }, { new: true });
        }

        async getAgencyPlanConsumers(planId: string): Promise<any | null>{
                return await agencyModel.find({planId:planId}).lean();
        }

        async getCompanyPlanConsumers(planId: string): Promise<any | null>{
                return await companyModel.find({planId:planId}).lean();
        }

}