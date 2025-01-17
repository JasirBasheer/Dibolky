
export interface IPlanRepository {
    getCompanyPlans(): Promise<any | null>
    getAgencyPlans(): Promise<any | null>
    getAgencyPlan(planId: string): Promise<any | null>
    getCompanyPlan(planId: string): Promise<any | null>
  }
  