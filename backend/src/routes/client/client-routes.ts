import { IClientController } from "@/controllers";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createClientRoutes = (): Router => {
  const router = Router();

  const clientController = container.resolve<IClientController>("ClientController");

  // Middlewares
  router.use(TokenMiddleWare)
  router.use(TenantMiddleWare);
  router.use(requireRoles(["client", "agency"]));

  // Get requests
  router.get("/", asyncHandler(clientController.getClient));
  router.get("/owner", asyncHandler(clientController.getOwner));
  router.get("/details", asyncHandler(clientController.getClientDetails));
  router.get("/initiate-payment/:invoice_id", asyncHandler(clientController.initiateRazorpayPayment));

  router.post("/invoice", asyncHandler(clientController.verifyInvoicePayment));

  return router;
};
