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
  router.get("/clients", asyncHandler(adminController.getClients));
  router.get("/transactions",asyncHandler(adminController.getTransactions))

  router
  .route("/client/:client_id")
  .get(asyncHandler(adminController.getClient))
  .patch(asyncHandler(adminController.toggleClientAccess))

  router
  .route("/plans/:plan_id")
  .patch(asyncHandler(planController.changePlanStatus))
  .put(asyncHandler(planController.editPlan))
  
  router
  .route("/plans")
  .get(asyncHandler(planController.getPlans))
  .post(asyncHandler(planController.createPlan))


  return router;
};
