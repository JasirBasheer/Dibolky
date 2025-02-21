import { IPlan, planDetails } from "../../shared/types/admin.types"

export interface IPlanRepository {
  getAgencyPlans(): Promise<IPlan[] | null>
  getAgencyPlan(planId: string): Promise<IPlan | null>
  createAgencyPlan(details: planDetails): Promise<IPlan | null>
  editAgencyPlan(details: planDetails): Promise<IPlan | null>
  changeAgencyPlanStatus(plan_id: string): Promise<IPlan | null>
}
