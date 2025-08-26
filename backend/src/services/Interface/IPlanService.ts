import { IPlanType } from "@/types";
import { FilterType } from "@/utils";
import { PlanType } from "@/validators";

export interface IPlanService {
    getPlans(query:FilterType): Promise<{plans:Partial<IPlanType>[],totalCount: number}>;
    getPlan(plan_id: string): Promise<Partial<IPlanType> >;

    createPlan(details: PlanType): Promise<void>
    editPlan(plan_id: string, details: PlanType): Promise<void>
    changePlanStatus(plan_id: string): Promise<void>
}
