import { Router } from "express";
import { container } from "tsyringe";
import { requireRoles, TenantMiddleWare, TokenMiddleWare, validateRequest } from "@/middlewares";
import { IAdController, IEntityController, IPortfolioController, IProviderController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createEntityRoutes = (): Router => {
  const router = Router();

  const entityController = container.resolve<IEntityController>("EntityController");
  const adController = container.resolve<IAdController>("AdController");
  const providerController = container.resolve<IProviderController>("ProviderController");
  const portfolioController = container.resolve<IPortfolioController>("PortfolioController")

  router.use(TokenMiddleWare);
  router.use(TenantMiddleWare);
  router.use(requireRoles(["agency", "client"]));

  // get
  router.get("/owner",asyncHandler(entityController.getOwner));

  router
  .route("/projects")
  .get(asyncHandler(entityController.getAllProjects))
  .patch(asyncHandler(entityController.markProjectAsCompleted))

  router.
  route("/testimonials")
  .get(asyncHandler(portfolioController.getAllTestimonials))
  .post(asyncHandler(portfolioController.createTestimonial))

  router.
  route("/agora")
  .get(asyncHandler(entityController.getAgoraTokens))
  .post(asyncHandler(portfolioController.createTestimonial))

  router
  .route("/connect/:provider")
  .get(asyncHandler(providerController.connectSocialPlatforms))
  router.get("/get-chats/:userId",asyncHandler(entityController.getChats));

  
  router.get("/invoices/:entity/:user_id",asyncHandler(entityController.getAllInvoices))
  router.get("/payments/:entity/:user_id",asyncHandler(entityController.getAllTransactions))
  router.get("/activity/:entity/:user_id",asyncHandler(entityController.getAllActivities))

  
  router.get("/get-meta-pages/:role/:userId",asyncHandler(providerController.getMetaPagesDetails));
  router.get("/contents/:role/:userId",asyncHandler(providerController.fetchContents));
  router.get("/get-connections/:entity/:user_id",asyncHandler(providerController.getConnections));
  router.get("/:role/:planId",asyncHandler(entityController.getMenu));
  
  router.post("/inbox/:entity/:user_id",asyncHandler(entityController.getInbox));
  router.post("/media/:entity/:user_id",asyncHandler(entityController.getMedia));
  router.get("/media/:entity/:user_id/:platform/:pageId/:mediaId/:mediaType",asyncHandler(providerController.getContentDetails));
  router.post("/message",asyncHandler(entityController.getInbox));
  router.get("/inboxMessages/:platform/:user_id/:conversationId",asyncHandler(entityController.getInboxMessages));

  router.
  route("/media/comment")
  .post(asyncHandler(providerController.replayToComments))
  .delete(asyncHandler(providerController.deleteComment))
  .patch(asyncHandler(providerController.hideComment))
  
  // callback
  router.post("/linkedin/callback",asyncHandler(providerController.handleLinkedinCallback))
  router.post("/x/callback",asyncHandler(providerController.handleXCallback))
  router.post("/gmail/callback",asyncHandler(providerController.handleGmailCallback))

  router.
  route('/content/scheduled/:userId')
  .get(asyncHandler(providerController.fetchAllScheduledContents))
  .patch(asyncHandler(providerController.rescheduleContent))
  router.post("/content/save/:platform/:user_id",asyncHandler(providerController.saveContent));

  // content
  router.post("/approve-content",asyncHandler(providerController.processContentApproval));
  router.post("/reject-content",asyncHandler(providerController.processContentReject));

  router.post("/initiate-s3-batch-upload",asyncHandler(entityController.initiateS3BatchUpload));
  router.post("/save-platform-token/:platform/:provider/:user_id",asyncHandler(providerController.saveSocialPlatformToken));

  
  router.get("/portfolio",asyncHandler(portfolioController.getPortfolios));

  // chat
  router.post("/chats",asyncHandler(entityController.getChat));
  router.post("/get-messages",asyncHandler(entityController.getMessages));
  router.post("/create-group",asyncHandler(entityController.createGroup));
  router.post("/update-profile",asyncHandler(entityController.updateProfile));
  router.get("/calender/:role/:userId",asyncHandler(entityController.getCalenderEvents))
  

  router.
  route("/ads/:role/:userId")
  .get(asyncHandler(adController.getAllAds))
  .post(asyncHandler(adController.createAd))
  .patch(asyncHandler(adController.createAd))
  .delete(asyncHandler(adController.createAd))

  router.
  route("/campaigns/:role/:userId")
  .get(asyncHandler(adController.getCampaigns))
  .post(asyncHandler(adController.createCampaign))
  .patch(asyncHandler(adController.createCampaign))
  .delete(asyncHandler(adController.createCampaign))

  router.
  route("/adsets/:role/:userId")
  .get(asyncHandler(adController.getAdSets))
  .post(asyncHandler(adController.createAdSet))
  .patch(asyncHandler(adController.createAdSet))
  .delete(asyncHandler(adController.createAdSet))
  
  return router;
};
