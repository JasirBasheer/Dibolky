import { Router } from "express";
import { container } from 'tsyringe';
import { IEntityController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";


export const createPublicRoutes = (): Router => {
  const router = Router();

  const entityController = container.resolve<IEntityController>('EntityController')

    router.get('/get-all-plans', asyncHandler(entityController.getAllPlans))
    router.get('/get-trial-plans', asyncHandler(entityController.getAllTrialPlans))
    router.get('/get-plan/:plan_id', asyncHandler(entityController.getPlan))
    router.get('/get-country', asyncHandler(entityController.getCountry))
    
    
    router.post('/check-mail', asyncHandler(entityController.checkMail))
    router.post('/create-agency', asyncHandler(entityController.registerAgency))
    router.post('/create-influencer', asyncHandler(entityController.createInfluencer))
    

  return router;
};


