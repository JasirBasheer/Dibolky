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

  async getPlans(): Promise<Partial<IPlanType>[]> {
    const plans = await this._planRepository.getPlans();
    return PortalMapper.PlansMapper(plans);
  }

  async getAllTrailPlans(): Promise<Partial<IPlan>[]> {
    const trailPlans = (await this._planRepository.getTrialPlans()) ?? [];
    return PortalMapper.TrailPlansMapper(trailPlans);
  }

  async getPlan(plan_id: string): Promise<Partial<IPlanType>> {
    const plan = await this._planRepository.getPlan(plan_id);
    if (!plan)throw new CustomError("Plan is not found please try again",400)
    return PortalMapper.PlanMapper(plan);
  }


  async createPlan(details: PlanDetailsDTO): Promise<void> {
    let menu = createMenu(details.menu as string[]);
    details.permissions = details.menu as string[];
    details.menu =  menu as unknown as IMenu | string[];
    const createdPlan = await this._planRepository.createPlan(details);
    if (!createdPlan) throw new CustomError("Error While creating Plan", 500);
  }

  async editPlan(details: PlanDetailsDTO): Promise<void> {
    let editedPlan;
    let menu = createMenu(details.menu as string[]) as IMenu[]
    details.permissions = details.menu as string[];
    console.log(details)
    details.menu = menu as unknown as IMenu | string[];
    editedPlan = await this._planRepository.editPlan(details);
    if (!editedPlan) throw new CustomError("Error While editing Plan", 500);
  }

  async changePlanStatus(plan_id: string): Promise<void> {
    let changedStatus = await this._planRepository.changePlanStatus(plan_id);
    if (!changedStatus)
      throw new CustomError("Error While changing Plan status", 500);
  }

  async getPlanDetails(plan_id: string): Promise<object> {
    const planDetails = await this._planRepository.getPlan(plan_id);
    const plainPlan = planDetails?.toObject ? planDetails.toObject() : planDetails;
    
    const planConsumers = await this._agencyRepository.getAgencyPlanConsumers(
      plan_id
    );
    const consumers = Array.isArray(planConsumers)
      ? planConsumers.map((item) => ({
          name: item.name,
          organizationName: item.organizationName,
          validity: item.validity,
          industry: item.industry,
        }))
      : [];

    const details = {
      ...plainPlan,
      planConsumers: consumers,
    };

    return details;
  }
}
