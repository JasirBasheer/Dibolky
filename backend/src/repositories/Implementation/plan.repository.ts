import { AgencyPlan, CompanyPlan } from '../../models/admin/planModel'
import { IPlanRepository } from '../Interface/IPlanRepository'

export default class PlanRepository implements IPlanRepository {
        async getCompanyPlans():Promise<any> {
                return await CompanyPlan.find()
        }
        async getAgencyPlans():Promise<any> {
                return await AgencyPlan.find()
        }
        async getAgencyPlan(planId: string): Promise<any> {
                return await AgencyPlan.findOne({_id:planId})
        }
        async getCompanyPlan(planId: string): Promise<any> {
                return await CompanyPlan.findOne({_id:planId})
        }
}