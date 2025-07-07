import { Router } from "express";
import { container } from "tsyringe";
import { asyncHandler } from "@/utils/async-handler-util";
import { IAdminController } from "../../controllers/Interface/IAdminController";
import { requireRoles } from "../../middlewares/required-roles";
import { TokenMiddleWare } from "@/middlewares";

export const createAdminRoutes = (): Router => {
  const router = Router();

  const adminController =
    container.resolve<IAdminController>("AdminController");

  router.use(TokenMiddleWare);
  router.use(requireRoles(["admin"]));

  router.get("/", asyncHandler(adminController.verifyAdmin));
  router.get("/clients", asyncHandler(adminController.recentClients));
  router.get("/recent-clients", asyncHandler(adminController.recentClients));
  router.get("/get-client/:role/:id", asyncHandler(adminController.getClient));
  router.get("/get-plan/:entity/:id", asyncHandler(adminController.getPlan));
  
  router.post("/create-plan", asyncHandler(adminController.createPlan));
  router.post("/edit-plan", asyncHandler(adminController.editPlan));
  router.post("/change-plan-status",asyncHandler(adminController.changePlanStatus));

  return router;
};
