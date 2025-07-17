import { IPlan } from "@/models/Interface/plan";


export class PortalMapper {
  static PlansMapper(plans: IPlan[]) {
    return plans.map(plan => ({
      _id: plan._id?.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      billingCycle: plan.billingCycle,
      maxProjects: plan.maxProjects,
      maxClients: plan.maxClients,
      isActive: plan.isActive,
    }));
  }
    static PlanMapper(plan: IPlan) {
    return {
      _id: plan._id?.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      billingCycle: plan.billingCycle,
      maxProjects: plan.maxProjects,
      maxClients: plan.maxClients,
      isActive: plan.isActive,
    }
  }

  static TrailPlansMapper(trailPlans: IPlan[]) {
     return trailPlans.map(plan => ({
      _id: plan._id?.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      billingCycle: plan.billingCycle,
      maxProjects: plan.maxProjects,
      maxClients: plan.maxClients,
      isActive: plan.isActive,
    }));
  }
}
