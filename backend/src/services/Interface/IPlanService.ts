import { PlanDetailsDTO } from "@/dto";
import { IPlan } from "@/models/Interface/plan";
import { IPlanType } from "@/types";
import { FilterType } from "@/utils";

export interface IPlanService {
    getPlans(query:FilterType): Promise<{plans:Partial<IPlanType>[],totalCount: number}>;
    getAllTrailPlans(): Promise<Partial<IPlan>[]>;
    getPlan(plan_id: string): Promise<Partial<IPlanType> >;

    createPlan(details: PlanDetailsDTO): Promise<void>
    editPlan(plan_id: string, details: PlanDetailsDTO): Promise<void>
    changePlanStatus(plan_id: string): Promise<void>
}