import { IPlan, planDetails } from "../../types/admin.types"

export interface IPlanRepository {
  getAgencyPlans(): Promise<IPlan[] | null>
  getAgencyPlan(planId: string): Promise<Partial<IPlan> | null>
  getInfluencerPlans(): Promise<IPlan[] | null>
  getInfluencerPlan(planId: string): Promise<Partial<IPlan> | null>
  createAgencyPlan(details: planDetails): Promise<Partial<IPlan> | null>
  createInfluencerPlan(details: planDetails): Promise<Partial<IPlan> | null>
  editAgencyPlan(details: planDetails): Promise<IPlan | null>
  changeAgencyPlanStatus(plan_id: string): Promise<IPlan | null>
}
