import { PlanDetailsDTO } from "@/dto";
import { IPlan } from "@/types";

export interface IPlanService {
    getAllPlans(): Promise<IPlan[]>
    getAllTrailPlans(): Promise<IPlan[]>;
    getPlan(plan_id: string): Promise<IPlan | null>;
    getPlans():Promise<IPlan[]>;

    createPlan(details: PlanDetailsDTO): Promise<void>
    editPlan(details: IPlan): Promise<void>
    changePlanStatus(plan_id: string): Promise<void>
    getPlanDetails(plan_id: string): Promise<object>
}