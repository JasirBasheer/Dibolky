import { IPlan, planDetails } from "../../types/admin"

export interface IPlanRepository {
  getPlans(): Promise<IPlan[] | null>
  getTrialPlans(): Promise<IPlan[] | null>
  getPlan(planId: string): Promise<IPlan | null>
  createPlan(details: planDetails): Promise<Partial<IPlan> | null>
  editPlan(details: planDetails): Promise<IPlan | null>
  changePlanStatus(plan_id: string): Promise<IPlan | null>
}
