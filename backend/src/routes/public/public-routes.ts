import { Router } from "express";
import { container } from 'tsyringe';
import { IEntityController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";
import { IPlanController } from "@/controllers/Interface/IPlanController";


export const createPublicRoutes = (): Router => {
  const router = Router();

    const entityController = container.resolve<IEntityController>('EntityController')
    const planController = container.resolve<IPlanController>('PlanController')

    router.get('/plans', asyncHandler(planController.getPlans))
    router.get('/plans/:plan_id', asyncHandler(planController.getPlan))
    router.get('/trial-plans', asyncHandler(planController.getAllTrialPlans))
    
    router.post('/check-mail', asyncHandler(entityController.checkMail))
    router.post('/agency', asyncHandler(entityController.createAgency))    

  return router;
};


