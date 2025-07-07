import { IClientController } from "@/controllers";
import { requireRoles, TenantMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createClientRoutes = (): Router => {
  const router = Router();

  const clientController = container.resolve<IClientController>('ClientController')

// Middlewares
router.use(TenantMiddleWare)
router.use(requireRoles(["Client","agency"]))


// Get requests
router.get('/', asyncHandler(clientController.getClient))
router.get('/owner', asyncHandler(clientController.getOwner))
router.get('/get-client-details', asyncHandler(clientController.getClientDetails))


  return router;
};
