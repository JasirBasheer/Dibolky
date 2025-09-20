import { Router } from "express";
import { container } from "tsyringe";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { IEntityController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createEntityRoutes = (): Router => {
  const router = Router();

  const entityController = container.resolve<IEntityController>("EntityController");

  router.use(TokenMiddleWare);
  router.use(TenantMiddleWare);
  router.use(requireRoles(["agency", "client"]));


  router.get("/invoices/:entity/:user_id",asyncHandler(entityController.getAllInvoices))
  router.get("/payments/:entity/:user_id",asyncHandler(entityController.getAllTransactions))
  router.get("/activity/:entity/:user_id",asyncHandler(entityController.getAllActivities))
  router.post("/media/:entity/:user_id",asyncHandler(entityController.getMedia));

  router.post("/update-profile",asyncHandler(entityController.updateProfile));
  router.get("/calender/:role/:userId",asyncHandler(entityController.getCalenderEvents))
  
  
  return router;
};
