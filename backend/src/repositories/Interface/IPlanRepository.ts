import { planDetails } from "../../shared/types/admin.types"

export interface IPlanRepository {
    getAgencyPlans(): Promise<any | null>
    getAgencyPlan(planId: string): Promise<any | null>
    getAgencyPlanConsumers(planId: string): Promise<any | null>
    
    // plan-management
    createAgencyPlan(details:planDetails):Promise<any>
    editAgencyPlan(details:planDetails):Promise<any>
    changeAgencyPlanStatus(id:string):Promise<any>

    
  }
  