import { Router } from "express";
import { container } from "tsyringe";
import { IAgencyController, IEntityController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";
import { IPlanController } from "@/controllers/Interface/IPlanController";
import { validateRequest } from "@/middlewares";
import { agencyZodSchema } from "@/validators/common/public";

export const createPublicRoutes = (): Router => {
  const router = Router();

  const entityController =
    container.resolve<IEntityController>("EntityController");
    const agencyController =
    container.resolve<IAgencyController>("AgencyController");  
  const planController = container.resolve<IPlanController>("PlanController");

  router.get("/plans", asyncHandler(planController.getPlans));
  router.get("/plans/:plan_id", asyncHandler(planController.getPlan));
  router.get("/exists", asyncHandler(agencyController.isExists));
  
  router
  .route("/trial")
  .get(asyncHandler(planController.getAllTrialPlans))
  .post(asyncHandler(agencyController.createTrialAgency))

  router.post(
    "/agency",
    validateRequest(agencyZodSchema),
    asyncHandler(agencyController.createAgency)
  );

  return router;
};
