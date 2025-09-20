import express from 'express'
import { Router } from "express";
import { container } from "tsyringe";
import { asyncHandler } from '@/utils/async-handler-util';
import { requireRoles, TenantMiddleWare, TokenMiddleWare } from '@/middlewares';
import { IInboxController } from '@/controllers';

export const createInboxRoutes = (): Router => {
  const router = Router();
  const inboxController = container.resolve<IInboxController>('InboxController')  
  router.use(TokenMiddleWare);
  router.use(TenantMiddleWare);
  router.use(requireRoles(["agency", "client"]));

  router.post("/inbox/:entity/:user_id",asyncHandler(inboxController.getInbox));
  router.get("/inboxMessages/:platform/:user_id/:conversationId",asyncHandler(inboxController.getInboxMessages));

  return router;
};
