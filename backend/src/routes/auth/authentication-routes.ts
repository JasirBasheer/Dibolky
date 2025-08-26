import { Router } from "express";
import { IAuthenticationController } from "../../controllers/Interface/IAuthenticationController";
import { container } from "tsyringe";
import { TokenMiddleWare } from "../../middlewares/token";
import { asyncHandler } from "@/utils/async-handler-util";
import { validateRequest } from "@/middlewares";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from "@/validators";

export const createAuthRoutes = (): Router => {
  const router = Router();

  const authenticationController = container.resolve<IAuthenticationController>("AuthenticationController");
  
  router.post("/login",
    validateRequest(loginSchema),
    asyncHandler(authenticationController.login)
  );
  
  router.post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    asyncHandler(authenticationController.forgotPassword)
  );

  router.post(
    "/reset-password/:token",
    validateRequest(resetPasswordSchema),
    asyncHandler(authenticationController.resetPassword)
  );

  router.post(
    "/logout",
    TokenMiddleWare,
    asyncHandler(authenticationController.logout)
  );

  return router;
};
