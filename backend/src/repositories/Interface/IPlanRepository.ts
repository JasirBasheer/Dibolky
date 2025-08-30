import { CreatePlanDto, EditPlanDto, PaginatedResponse, QueryDto } from "@/dtos";
import { PlanDoc } from "@/models";

export interface IPlanRepository
 {
  getPlans(query: QueryDto): Promise<PaginatedResponse<PlanDoc>>
  getPlan(planId: string): Promise<PlanDoc | null>
  createPlan(details: CreatePlanDto): Promise<PlanDoc | null>
  editPlan(_id: string, details: EditPlanDto): Promise<PlanDoc | null>
  changePlanStatus(plan_id: string): Promise<PlanDoc | null>
}
