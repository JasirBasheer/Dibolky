import { Router } from "express";
import { container } from "tsyringe";
import { asyncHandler } from "@/utils/async-handler-util";
import { IAdminController } from "../../controllers/Interface/IAdminController";
import { requireRoles } from "../../middlewares/required-roles";
import { TokenMiddleWare } from "@/middlewares";
import { IPlanController } from "@/controllers/Interface/IPlanController";

export const createAdminRoutes = (): Router => {
  const router = Router();

  const adminController = container.resolve<IAdminController>("AdminController");
  const planController = container.resolve<IPlanController>('PlanController')
  

  router.use(TokenMiddleWare);
  router.use(requireRoles(["admin"]));

  router.get("/", asyncHandler(adminController.verifyAdmin));
  router.get("/clients", asyncHandler(adminController.recentClients));
  router.get("/recent-clients", asyncHandler(adminController.recentClients));
  router.get("/get-client/:client_id", asyncHandler(adminController.getClient));

  router
  .route("/plans/:plan_id")
  .get(asyncHandler(planController.getPlanWithConsumers))
  .patch(asyncHandler(planController.changePlanStatus))
  
  router
  .route("/plans")
  .get(asyncHandler(planController.getPlans))
  .post(asyncHandler(planController.createPlan))
  .put(asyncHandler(planController.editPlan))


  return router;
};
