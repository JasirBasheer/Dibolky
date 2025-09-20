import { IProviderController } from "@/controllers";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createProviderRoutes = (): Router => {
  const router = Router();

 const providerController = container.resolve<IProviderController>("ProviderController");

  router.use(TokenMiddleWare)
  router.use(TenantMiddleWare);
  router.use(requireRoles(["client", "agency"]));

   router
  .route("/connect/:provider")
  .get(asyncHandler(providerController.connectSocialPlatforms))

  router.get("/get-meta-pages/:role/:userId",asyncHandler(providerController.getMetaPagesDetails));
  router.get("/contents/:role/:userId",asyncHandler(providerController.fetchContents));
  router.get("/get-connections/:entity/:user_id",asyncHandler(providerController.getConnections));
  router.get("/media/:entity/:user_id/:platform/:pageId/:mediaId/:mediaType",asyncHandler(providerController.getContentDetails));
  router.
  route("/media/comment")
  .post(asyncHandler(providerController.replayToComments))
  .delete(asyncHandler(providerController.deleteComment))
  .patch(asyncHandler(providerController.hideComment))
  
  router.post("/linkedin/callback",asyncHandler(providerController.handleLinkedinCallback))
  router.post("/x/callback",asyncHandler(providerController.handleXCallback))
  router.post("/gmail/callback",asyncHandler(providerController.handleGmailCallback))

  router.
  route('/content/scheduled/:userId')
  .get(asyncHandler(providerController.fetchAllScheduledContents))
  .patch(asyncHandler(providerController.rescheduleContent))
  router.post("/content/save/:platform/:user_id",asyncHandler(providerController.saveContent));

  router.post("/approve-content",asyncHandler(providerController.processContentApproval));
  router.post("/reject-content",asyncHandler(providerController.processContentReject));
  router.post("/save-platform-token/:platform/:provider/:user_id",asyncHandler(providerController.saveSocialPlatformToken));


  return router;
};
