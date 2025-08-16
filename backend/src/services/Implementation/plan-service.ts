import { inject, injectable } from "tsyringe";
import { IPlanService } from "../Interface/IPlanService";
import { IPlanRepository } from "@/repositories/Interface/IPlanRepository";
import { IMenu, IPlanType } from "@/types";
import { PlanDetailsDTO } from "@/dto";
import { createMenu } from "@/utils/menu.utils";
import { CustomError } from "mern.common";
import { IAgencyRepository } from "@/repositories/Interface/IAgencyRepository";
import { PortalMapper } from "@/mappers/portal/portal-mapper";
import { getPriceConversionFunc } from "@/utils/currency-conversion.utils";
import { IPlan } from "@/models/Interface/plan";
import { FilterType, QueryParser } from "@/utils";

@injectable()
export class PlanService implements IPlanService {
  private _planRepository: IPlanRepository;
  private _agencyRepository: IAgencyRepository;

  constructor(
    @inject("PlanRepository") planRepository: IPlanRepository,
    @inject("AgencyRepository") agencyRepository: IAgencyRepository
  ) {
    this._planRepository = planRepository;
    this._agencyRepository = agencyRepository;
  }

  async getPlans(
    query: FilterType
  ): Promise<{ plans: Partial<IPlanType>[]; totalCount: number }> {
    const { page, limit, sortBy, sortOrder } = query;
    const filter = QueryParser.buildFilter({
      searchText: query.query,
      searchFields: ["name", "description", "billingCycle"],
      additionalFilters: {
        ...(query.type && query.type !== "all" && query.type !== "" && { type: query.type })
        },
    });
    const options = {
      page,
      limit,
      sort: sortBy
        ? ({ [sortBy]: sortOrder === "desc" ? -1 : 1 } as Record<
            string,
            1 | -1
          >)
        : {},
    };

    const result = await this._planRepository.getPlans(filter, options);
    const MappedPlans = PortalMapper.PlansMapper(result.data);
    return { plans: MappedPlans, totalCount: result.totalCount };
  }

  async getAllTrailPlans(): Promise<Partial<IPlan>[]> {
    const trailPlans = (await this._planRepository.getTrialPlans()) ?? [];
    return PortalMapper.TrailPlansMapper(trailPlans);
  }

  async getPlan(plan_id: string): Promise<Partial<IPlanType>> {
    const plan = await this._planRepository.getPlan(plan_id);
    if (!plan) throw new CustomError("Plan is not found please try again", 400);
    return PortalMapper.PlanMapper(plan);
  }

  async createPlan(details: PlanDetailsDTO): Promise<void> {
    let menu = createMenu(details.menu as string[]);
    details.permissions = details.menu as string[];
    details.menu = menu as unknown as IMenu | string[];
    const createdPlan = await this._planRepository.createPlan(details);
    if (!createdPlan) throw new CustomError("Error While creating Plan", 500);
  }

  async editPlan(plan_id: string, details: PlanDetailsDTO): Promise<void> {
    let editedPlan;
    console.log(details, "detilasss");
    if (Array.isArray(details?.menu) && details.menu.length > 0) {
      let menu = createMenu(details.menu as string[]) as IMenu[];
      details.permissions = details.menu as string[];
      details.menu = menu as unknown as IMenu | string[];
    }

    editedPlan = await this._planRepository.editPlan(plan_id, details);
    if (!editedPlan) throw new CustomError("Error While editing Plan", 500);
  }

  async changePlanStatus(plan_id: string): Promise<void> {
    let changedStatus = await this._planRepository.changePlanStatus(plan_id);
    if (!changedStatus)
      throw new CustomError("Error While changing Plan status", 500);
  }
}
