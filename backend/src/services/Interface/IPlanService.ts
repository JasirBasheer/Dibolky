import { PlanDetailsDTO } from "@/dto";
import { IPlan } from "@/models/Interface/plan";
import { IPlanType } from "@/types";

export interface IPlanService {
    getAllPlans(userCountry:string): Promise<Partial<IPlanType>[]>;
    getAllTrailPlans(): Promise<Partial<IPlan>[]>;
    getPlan(plan_id: string, userCountry?:string): Promise<Partial<IPlanType> >;
    getPlans():Promise<IPlan[]>;

    createPlan(details: PlanDetailsDTO): Promise<void>
    editPlan(details: PlanDetailsDTO): Promise<void>
    changePlanStatus(plan_id: string): Promise<void>
    getPlanDetails(plan_id: string): Promise<object>
}