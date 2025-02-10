import { planDetails } from "../../shared/types/admin.types"

export interface IPlanRepository {
    getCompanyPlans(): Promise<any | null>
    getAgencyPlans(): Promise<any | null>
    getAgencyPlan(planId: string): Promise<any | null>
    getCompanyPlan(planId: string): Promise<any | null>
    getAgencyPlanConsumers(planId: string): Promise<any | null>
    getCompanyPlanConsumers(planId: string): Promise<any | null>
    
    // plan-management
    createAgencyPlan(details:planDetails):Promise<any>
    createCompanyPlan(details:planDetails):Promise<any>
    editAgencyPlan(details:planDetails):Promise<any>
    editCompanyPlan(details:planDetails):Promise<any>
    changeAgencyPlanStatus(id:string):Promise<any>
    changeCompanyPlanStatus(id:string):Promise<any>

    
  }
  