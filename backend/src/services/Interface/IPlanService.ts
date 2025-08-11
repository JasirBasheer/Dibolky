import { PlanDetailsDTO } from "@/dto";
import { IPlan } from "@/models/Interface/plan";
import { IPlanType } from "@/types";

export interface IPlanService {
    getPlans(): Promise<Partial<IPlanType>[]>;
    getAllTrailPlans(): Promise<Partial<IPlan>[]>;
    getPlan(plan_id: string): Promise<Partial<IPlanType> >;

    createPlan(details: PlanDetailsDTO): Promise<void>
    editPlan(details: PlanDetailsDTO): Promise<void>
    changePlanStatus(plan_id: string): Promise<void>
    getPlanDetails(plan_id: string): Promise<object>
}