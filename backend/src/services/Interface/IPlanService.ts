import { CreatePlanDto, EditPlanDto, PaginatedResponse, QueryDto } from "@/dtos";
import { Plan } from "@/models";

export interface IPlanService {
    getPlans(query:QueryDto): Promise<PaginatedResponse<Plan>>;
    getPlan(planId: string): Promise<Plan>;

    createPlan(details: CreatePlanDto): Promise<Plan>
    editPlan(planId: string, details: EditPlanDto): Promise<Plan>
    changePlanStatus(planId: string): Promise<void>
}
