import { Plan, PlanDoc } from "@/models";

export class PlanMapper {
  static toResponse(plan: PlanDoc): Plan {
    return {
      id: plan._id?.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      billingCycle: plan.billingCycle,
      maxProjects: plan.maxProjects,
      maxClients: plan.maxClients,
      isActive: plan.isActive,
      permissions: plan.permissions,
      createdAt: plan.createdAt,
      menu: plan.menu,
      type: plan.type,
    };
  }

  static toTrailResponse(plan: PlanDoc): Partial<Plan> {
    return {
      id: plan._id?.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      billingCycle: plan.billingCycle,
      maxProjects: plan.maxProjects,
      maxClients: plan.maxClients,
      isActive: plan.isActive,
    };
  }
}
