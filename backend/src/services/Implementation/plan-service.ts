import { inject, injectable } from "tsyringe";
import { IPlanService } from "../Interface/IPlanService";
import { IPlanRepository } from "@/repositories/Interface/IPlanRepository";
import { IPlan } from "@/types";
import { PlanDetailsDTO } from "@/dto";
import { createNewPlanMenu } from "@/utils/menu.utils";
import { CustomError } from "mern.common";
import { IAgencyRepository } from "@/repositories/Interface/IAgencyRepository";



@injectable()
export default class PlanService implements IPlanService {
    private _planRepository: IPlanRepository;
    private _agencyRepository: IAgencyRepository;

    
    constructor(
        @inject('PlanRepository') _planRepository: IPlanRepository,
        @inject("AgencyRepository") _agencyRepository: IAgencyRepository,
    ) {
        this._planRepository = _planRepository
        this._agencyRepository = _agencyRepository
    }

    async getAllPlans()
        : Promise<IPlan[]> {
        const plans = await this._planRepository.getPlans()
        return plans ?? []
    }

    async getAllTrailPlans() : Promise<IPlan[]>{
        return await this._planRepository.getTrialPlans() ?? []
    }

    async getPlan(plan_id: string): Promise<IPlan | null> {
        return await this._planRepository.getPlan(plan_id)
    }

     async getPlans(): Promise<IPlan[]> {
        let plans = await this._planRepository.getPlans()
        return plans ?? []
    }

     async createPlan(details: PlanDetailsDTO): Promise<void> {
    let menu = createNewPlanMenu(details.menu as string[]);
    details.permissions = details.menu as string[];
    details.menu = menu;
    const createdPlan = await this._planRepository.createPlan(details);
    if (!createdPlan) throw new CustomError("Error While creating Plan", 500);
  }

  async editPlan( details: IPlan): Promise<void> {
    let editedPlan;
    let menu = createNewPlanMenu(details.menu as string[]);
    details.menu = menu;
    editedPlan = await this._planRepository.editPlan(details);
    if (!editedPlan) throw new CustomError("Error While editing Plan", 500);
  }

  async changePlanStatus( plan_id: string): Promise<void> {
    let changedStatus = await this._planRepository.changePlanStatus(plan_id);
    if (!changedStatus)throw new CustomError("Error While changing Plan status", 500);
  }

  async getPlanDetails(plan_id: string): Promise<object> {
    const planDetails = await this._planRepository.getPlan(plan_id);
    const plainPlan = planDetails?.toObject
      ? planDetails.toObject()
      : planDetails;
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
