import { AgencyPlan, CompanyPlan } from '../../models/admin/planModel'

class PlanRepository {
        async getCompanyPlans() {
                return await CompanyPlan.find()
        }
        async getAgencyPlans() {
                return await AgencyPlan.find()
        }
        async getAgencyPlan(planId: string): Promise<any> {
                return await AgencyPlan.findOne({_id:planId})
        }
        async getCompanyPlan(planId: string): Promise<any> {
                return await CompanyPlan.findOne({_id:planId})
        }
}

export default PlanRepository