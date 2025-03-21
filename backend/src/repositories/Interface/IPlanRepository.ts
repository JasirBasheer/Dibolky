import { IPlan, planDetails } from "../../types/admin.types"

export interface IPlanRepository {
  getPlans(): Promise<IPlan[] | null>
  getPlan(planId: string): Promise<Partial<IPlan> | null>
  createPlan(details: planDetails): Promise<Partial<IPlan> | null>
  editPlan(details: planDetails): Promise<IPlan | null>
  changePlanStatus(plan_id: string): Promise<IPlan | null>
}
