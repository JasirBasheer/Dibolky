import { Router } from "express";
import { container } from "tsyringe";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { IEntityController, IPortfolioController, IProviderController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createEntityRoutes = (): Router => {
  const router = Router();

  const entityController = container.resolve<IEntityController>("EntityController");
  const providerController = container.resolve<IProviderController>("ProviderController");
  const portfolioController = container.resolve<IPortfolioController>("PortfolioController")

  router.use(TokenMiddleWare);
  router.use(TenantMiddleWare);
  router.use(requireRoles(["agency", "client"]));

  // get
  router.get("/owner",asyncHandler(entityController.getOwner));

  router.get("/get-tasks",asyncHandler(entityController.getAllProjects));

  router.get("/projects/:page",asyncHandler(entityController.getAllProjects));

  router.get("/get-chats/:userId",asyncHandler(entityController.getChats));
  
  router
  .route("/connect/:provider")
  .get(asyncHandler(providerController.connectSocialPlatforms))

  
  router.get("/invoices/:entity/:user_id",asyncHandler(entityController.getAllInvoices))
  
  router.get("/payments/:entity/:user_id",asyncHandler(entityController.getAllTransactions))

  router.get("/activity/:entity/:user_id",asyncHandler(entityController.getAllActivities))

  
  router.get("/get-meta-pages/:access_token",asyncHandler(providerController.getMetaPagesDetails));
  router.get("/contents/:user_id",asyncHandler(entityController.fetchContents));
  router.get("/get-scheduled-contents/:user_id",asyncHandler(entityController.fetchAllScheduledContents));
  router.get("/get-connections/:entity/:user_id",asyncHandler(entityController.getConnections));
  router.get("/:role/:planId",asyncHandler(entityController.getMenu));
  
  router.post("/inbox/:entity/:user_id",asyncHandler(entityController.getInbox));
  router.post("/media/:entity/:user_id",asyncHandler(entityController.getMedia));
  router.get("/media/:entity/:user_id/:platform/:pageId/:mediaId/:mediaType",asyncHandler(entityController.getContentDetails));
  router.post("/message",asyncHandler(entityController.getInbox));
  router.get("/inboxMessages/:platform/:user_id/:conversationId",asyncHandler(entityController.getInboxMessages));

  router.post('/media/comments',asyncHandler(entityController.replayToComments))
  
  
  // callback
  router.post("/linkedin/callback",asyncHandler(entityController.handleLinkedinCallback))
  router.post("/x/callback",asyncHandler(entityController.handleXCallback))
  router.post("/google/callback",asyncHandler(entityController.handleGoogleCallback))

  // content
  router.post("/approve-content",asyncHandler(providerController.processContentApproval));
  router.post("/reject-content",asyncHandler(providerController.processContentReject));
  router.post("/reschedulec-content",asyncHandler(providerController.reScheduleContent));
  router.post("/content/save/:platform/:user_id",asyncHandler(entityController.saveContent));
  router.post("/initiate-s3-batch-upload",asyncHandler(entityController.initiateS3BatchUpload));
  router.post("/save-platform-token/:platform/:provider/:user_id",asyncHandler(providerController.saveSocialPlatformToken));

  // aws s3
  router.post("/get-signedUrl",asyncHandler(entityController.getS3ViewUrl));
  router.post("/get-s3Upload-url",asyncHandler(entityController.getUploadS3Url));
  
  router.get("/portfolio",asyncHandler(portfolioController.getPortfolios));

  // chat
  router.post("/chats",asyncHandler(entityController.getChat));
  router.post("/get-messages",asyncHandler(entityController.getMessages));
  router.post("/create-group",asyncHandler(entityController.createGroup));

  // settings
  router.post("/update-profile",asyncHandler(entityController.updateProfile));

  router.
  route("/testimonials")
  .get(asyncHandler(portfolioController.getAllTestimonials))
  .post(asyncHandler(portfolioController.createTestimonial))

  return router;
};
