import { Router } from "express";
import { container } from "tsyringe";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { IAgencyController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createAgencyRoutes = (): Router => {
  const router = Router();

const agencyController = container.resolve<IAgencyController>('AgencyController')

// Middlewares
router.use(TokenMiddleWare)
router.use(TenantMiddleWare)
router.use(requireRoles(["agency"]))


// Get requests
router.get('/', asyncHandler(agencyController.getAgency))
router.get('/owner-details', asyncHandler(agencyController.getAgencyOwnerDetails))
router.get('/availabe-users', asyncHandler(agencyController.getAvailableUsers))
router.get('/clients', asyncHandler(agencyController.getAllClients))
router.get('/client/:id', asyncHandler(agencyController.getClient))
router.get('/projects-count', asyncHandler(agencyController.getProjectsCount))
router.get('/clients-count', asyncHandler(agencyController.getClientsCount))
router.get('/get-initial-set-up', asyncHandler(agencyController.getInitialSetUp))
router.get('/get-payment-integration-status', asyncHandler( agencyController.getPaymentIntegrationStatus))


// Patch requests
router.patch('/edit-project-status', asyncHandler(agencyController.editProjectStatus))



// Post requests
router.post('/client', asyncHandler(agencyController.createClient))
router.post('/upload', asyncHandler(agencyController.uploadContent))
router.post('/integrate-payment-gateway', asyncHandler( agencyController.IntegratePaymentGateWay))


  return router;
};
