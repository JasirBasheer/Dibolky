import { Router } from "express";
import { container } from "tsyringe";
import { IAgencyController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";
import { IPlanController } from "@/controllers/Interface/IPlanController";
import { validateRequest } from "@/middlewares";
import { agencyTrialZodSchema, agencyZodSchema } from "@/validators/common/public";

export const createPublicRoutes = (): Router => {
  const router = Router();

    const agencyController =
    container.resolve<IAgencyController>("AgencyController");  
  const planController = container.resolve<IPlanController>("PlanController");

  router.get("/plans", asyncHandler(planController.getPlans));
  router.get("/plans/:plan_id", asyncHandler(planController.getPlan));
  router.get("/exists", asyncHandler(agencyController.isExists));
  
  router
  .route("/trial")
  .get(asyncHandler(planController.getAllTrialPlans))
  .post(
    validateRequest(agencyTrialZodSchema),
    asyncHandler(agencyController.createTrialAgency)
  );

  router.post(
    "/agency",
    validateRequest(agencyZodSchema),
    asyncHandler(agencyController.createAgency)
  );

  return router;
};
