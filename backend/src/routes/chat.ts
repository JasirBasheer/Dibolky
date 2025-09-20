import { IChatController } from "@/controllers";
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from "@/middlewares";
import { asyncHandler } from "@/utils/async-handler-util";
import { Router } from "express";
import { container } from "tsyringe";

export const createChatRoutes = (): Router => {
  const router = Router();

  const chatController = container.resolve<IChatController>("ChatController");

  router.use(TokenMiddleWare)
  router.use(TenantMiddleWare);
  router.use(requireRoles(["client", "agency"]));


  router.get("/get-chats/:userId",asyncHandler(chatController.getChats))
  router.post("/chats",asyncHandler(chatController.getChat));
  
  return router;
};
