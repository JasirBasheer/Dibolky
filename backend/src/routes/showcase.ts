import { IPortfolioController } from "@/controllers";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createShowCaseRoutes = (): Router => {
  const router = Router();

  const portfolioController = container.resolve<IPortfolioController>("PortfolioController")

  router.use(TokenMiddleWare)
  router.use(TenantMiddleWare);
  router.use(requireRoles(["client", "agency"]));

  router.
  route("/testimonials")
  .get(asyncHandler(portfolioController.getAllTestimonials))
  .post(asyncHandler(portfolioController.createTestimonial))
  router.get("/portfolio",asyncHandler(portfolioController.getPortfolios));

  
  return router;
};
