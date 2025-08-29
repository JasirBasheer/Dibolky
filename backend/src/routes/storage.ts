import { IStorageController } from "@/controllers";
import { requireRoles, TokenMiddleWare, validateRequest } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { fileSchema } from "@/validators";
import { Router } from "express";
import { container } from "tsyringe";

export const createStorageRoutes = (): Router => {
  const router = Router();

  const storageController =
    container.resolve<IStorageController>("StorageController");

  router.use(TokenMiddleWare);
  router.use(requireRoles(["client", "agency"]));

  router.post(
    "/presign",
    validateRequest(fileSchema),
    asyncHandler(storageController.presign)
  );

  router.get("/signed-url", 
    asyncHandler(storageController.signedS3Url)
  );

  return router;
};
