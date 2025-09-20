import { IProjectController } from "@/controllers";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createProjectRoutes = (): Router => {
  const router = Router();

  const projectController = container.resolve<IProjectController>("ProjectController");

  router.use(TokenMiddleWare)
  router.use(TenantMiddleWare);
  router.use(requireRoles(["client", "agency"]));

  router
  .route("/projects")
  .get(asyncHandler(projectController.getAllProjects))
  .patch(asyncHandler(projectController.markProjectAsCompleted))

  
  return router;
};
