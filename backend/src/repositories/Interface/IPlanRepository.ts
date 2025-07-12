import { PlanDetailsDTO } from "@/dto"
import { IPlan } from "@/models/Interface/plan"
import { IPlanType } from "@/types"
export interface IPlanRepository
 {
  getPlans(): Promise<IPlan[] | null>
  getTrialPlans(): Promise<IPlan[] | null>
  getPlan(planId: string): Promise<IPlan | null>
  createPlan(details: PlanDetailsDTO): Promise<Partial<IPlan> | null>
  editPlan(details: IPlanType): Promise<IPlan | null>
  changePlanStatus(plan_id: string): Promise<IPlan | null>
}
