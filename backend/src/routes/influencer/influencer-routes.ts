import { IInfluencerController } from "@/controllers";
import { requireRoles, TenantMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createInfluencerRoutes = (): Router => {
  const router = Router();

const influencerController = container.resolve<IInfluencerController>('InfluencerController')

// Middlewares
router.use(TenantMiddleWare)
router.use(requireRoles(["influencer"]))


// Get requests
router.get('/', asyncHandler(influencerController.getInfluencer))



  return router;
};
