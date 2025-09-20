import { Router } from "express";
import { container } from "tsyringe";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import {
  IAgencyController,
  IClientController,
  IPortfolioController,
} from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createAgencyRoutes = (): Router => {
  const router = Router();

  const agencyController =
    container.resolve<IAgencyController>("AgencyController");
  const portfolioController = container.resolve<IPortfolioController>(
    "PortfolioController"
  );
  const clientController =
    container.resolve<IClientController>("ClientController");

  router.use(TokenMiddleWare);
  router.use(TenantMiddleWare);
  router.use(requireRoles(["agency"]));

  router.get("/", asyncHandler(agencyController.getAgency));
  router.get("/owner-details",asyncHandler(agencyController.getAgencyOwnerDetails));
  router.get("/users", asyncHandler(agencyController.getAvailableUsers));
  router.get("/get-initial-set-up", asyncHandler(agencyController.getInitialSetUp));
  router.get("/get-payment-integration-status",asyncHandler(agencyController.getPaymentIntegrationStatus));

  router
    .get("/clients/:client_id", asyncHandler(agencyController.getClient))
    .patch("/clients/:client_id", asyncHandler(agencyController.getClient));

  router
    .route("/clients")
    .get(asyncHandler(clientController.getAllClients))
    .post(asyncHandler(clientController.createClient));

  router
    .route("/projects")
    .get(asyncHandler(agencyController.getProjects))
    .patch(asyncHandler(agencyController.editProjectStatus))
    .post(asyncHandler(agencyController.getProjects));

  router
    .route("/invoices")
    .patch(asyncHandler(clientController.getAllClients))
    .post(asyncHandler(agencyController.createInvoice));

  router
    .route("/plans")
    .get(asyncHandler(agencyController.getAllPlans))
    .post(asyncHandler(agencyController.upgradePlan));

  router
    .route("/portfolio")
    .post(asyncHandler(portfolioController.createPortfolio))
    .patch(asyncHandler(portfolioController.editPortfolio));

  router.post("/mail", asyncHandler(agencyController.handleSendMail));
  router.post("/upload", asyncHandler(agencyController.uploadContent));
  router.post("/integrate-payment-gateway",asyncHandler(agencyController.IntegratePaymentGateWay));
  return router;
};
