import { inject, injectable } from "tsyringe";
import { IPlanService } from "../Interface/IPlanService";
import { IPlanRepository } from "@/repositories/Interface/IPlanRepository";
import { IMenu } from "@/types";
import { createMenu } from "@/utils/menu.utils";
import { CustomError } from "mern.common";
import { CreatePlanDto, EditPlanDto, PaginatedResponse, PlanMapper, QueryDto } from "@/dtos";
import { Plan } from "@/models";
import { IClientTenantRepository } from "@/repositories";
import { ROLES } from "@/utils";

@injectable()
export class PlanService implements IPlanService {
  private _planRepository: IPlanRepository;
  private _clientTenantRepository: IClientTenantRepository;

  constructor(
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("ClientTenantRepository") clientTenantRepository: IClientTenantRepository,
  ) {
    this._planRepository = planRepository;
    this._clientTenantRepository = clientTenantRepository;
  }

  async getMenu(
    orgId: string,
    role: string, 
    planId: string
  ): Promise<IMenu[]> {
    if (role === ROLES.AGENCY) {
      const plan = await this._planRepository.getPlan(planId);
      if (!plan) throw new CustomError("Plan not found", 404);
      return plan.menu as unknown as IMenu[];
    } 
    const client = await this._clientTenantRepository.getClientById(orgId,planId);
      if (!client || !client.menu)throw new CustomError("Client menu not found", 500);
    return client.menu;
  }

  async getPlans(
    query: QueryDto
  ): Promise<PaginatedResponse<Plan>> {
    const result = await this._planRepository.getPlans(query);
    return {
      ...result,
      data: result.data.map((plan) => PlanMapper.toResponse(plan))
    }
  }


  async getPlan(planId: string): Promise<Plan> {
    const plan = await this._planRepository.getPlan(planId);
    if (!plan) throw new CustomError("Plan is not found please try again", 400);
    return PlanMapper.toResponse(plan);
  }

  async createPlan(details: CreatePlanDto): Promise<Plan> {
    let menu = createMenu(details.menu as string[]);
    details.permissions = details.menu as string[];
    details.menu = menu as unknown as IMenu | string[];
    const createdPlan = await this._planRepository.createPlan(details);
    if (!createdPlan) throw new CustomError("Error While creating Plan", 500);
    return PlanMapper.toResponse(createdPlan)
  }

  async editPlan(plan_id: string, details: EditPlanDto): Promise<Plan> {
    let editedPlan;
    if (Array.isArray(details?.menu) && details.menu.length > 0) {
      let menu = createMenu(details.menu as string[]) as IMenu[];
      details.permissions = details.menu as string[];
      details.menu = menu as unknown as IMenu | string[];
    }

    editedPlan = await this._planRepository.editPlan(plan_id, details);
    if (!editedPlan) throw new CustomError("Error While editing Plan", 500);
    return PlanMapper.toResponse(editedPlan)
  }

  async changePlanStatus(plan_id: string): Promise<void> {
    let changedStatus = await this._planRepository.changePlanStatus(plan_id);
    if (!changedStatus)throw new CustomError("Error While changing Plan status", 500);
  }
}
