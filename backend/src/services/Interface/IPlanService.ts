import { CreatePlanDto, EditPlanDto, PaginatedResponse, QueryDto } from "@/dtos";
import { Plan } from "@/models";
import { IMenu } from "@/types";

export interface IPlanService {
    getMenu(orgId: string, role:string, planId: string): Promise<IMenu[]>;
    getPlans(query:QueryDto): Promise<PaginatedResponse<Plan>>;
    getPlan(planId: string): Promise<Plan>;

    createPlan(details: CreatePlanDto): Promise<Plan>
    editPlan(planId: string, details: EditPlanDto): Promise<Plan>
    changePlanStatus(planId: string): Promise<void>
}
