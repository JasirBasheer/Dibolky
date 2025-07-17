import { Router } from "express";
import { IAuthenticationController } from "../../controllers/Interface/IAuthenticationController";
import { container } from "tsyringe";
import { TokenMiddleWare } from "../../middlewares/token";
import { asyncHandler } from "@/utils/async-handler-util";

export const createAuthRoutes = (): Router => {
  const router = Router();

  const authenticationController = container.resolve<IAuthenticationController>(
    "AuthenticationController"
  );
  router.post("/login", asyncHandler(authenticationController.login));
  router.post("/forgot-password", asyncHandler(authenticationController.forgotPassword));
  router.post("/reset-password/:token", asyncHandler(authenticationController.resetPassword));
  router.post("/logout", TokenMiddleWare, asyncHandler(authenticationController.logout));

  return router;
};
