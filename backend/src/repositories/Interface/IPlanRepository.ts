import { PlanDetailsDTO } from "@/dto"
import { IPlan } from "@/models/Interface/plan"

export interface IPlanRepository
 {
  getPlans(filter?: Record<string, unknown> , options?: { page?: number, limit?: number, sort?: any }): Promise<{ data: IPlan[]; totalCount: number }>
  getPlan(planId: string): Promise<IPlan | null>
  createPlan(details: PlanDetailsDTO): Promise<Partial<IPlan> | null>
  editPlan(_id: string, details: PlanDetailsDTO): Promise<IPlan | null>
  changePlanStatus(plan_id: string): Promise<IPlan | null>
}
