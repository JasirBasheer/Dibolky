import { IAdController } from "@/controllers";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createLeadRoutes = (): Router => {
  const router = Router();
  const adController = container.resolve<IAdController>("AdController");

  router.use(TokenMiddleWare)
  router.use(TenantMiddleWare);
  router.use(requireRoles(["client", "agency"]));

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
  .patch(asyncHandler(adController.toggleCampaignStatus))
  .delete(asyncHandler(adController.deleteCampaign))

  router.
  route("/adsets/:role/:userId")
  .get(asyncHandler(adController.getAdSets))
  .post(asyncHandler(adController.createAdSet))
  .patch(asyncHandler(adController.createAdSet))
  .delete(asyncHandler(adController.createAdSet))

  return router;
};
