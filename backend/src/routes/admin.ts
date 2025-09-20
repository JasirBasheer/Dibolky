import { Router } from "express";
import { container } from "tsyringe";
import { asyncHandler } from "@/utils/async-handler-util";
import { IAdminController } from "../controllers/Interface/IAdminController";
import { requireRoles } from "../middlewares/required-roles";
import { TokenMiddleWare, validateRequest } from "@/middlewares";
import { IPlanController } from "@/controllers/Interface/IPlanController";
import { IAgencyController, ITransactionController } from "@/controllers";
import { PlanSchema } from "@/validators";

export const createAdminRoutes = (): Router => {
  const router = Router();

  const adminController = container.resolve<IAdminController>("AdminController");
  const planController = container.resolve<IPlanController>('PlanController');
  const agencyController = container.resolve<IAgencyController>('AgencyController');
  const transactionController = container.resolve<ITransactionController>('TransactionController');
  

  router.use(TokenMiddleWare);
  router.use(requireRoles(["admin"]));

  router.get("/", asyncHandler(adminController.verifyAdmin));
  router.get("/clients", asyncHandler(agencyController.getAllAgencies));
  router.get("/transactions",asyncHandler(transactionController.getTransactions))

  router
  .route("/client/:clientId")
  .get(asyncHandler(agencyController.getAgencyById))
  .patch(asyncHandler(agencyController.toggleAgencyAccess))

  router
  .route("/plans/:planId")
  .patch(asyncHandler(planController.changePlanStatus))
  .put(asyncHandler(planController.editPlan))
  
  router
  .route("/plans")
  .get(asyncHandler(planController.getPlans))
  .post(
    validateRequest(PlanSchema),
    asyncHandler(planController.createPlan)
  )
  return router;
};
