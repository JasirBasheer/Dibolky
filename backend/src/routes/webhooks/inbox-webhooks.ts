import express, { NextFunction, Request, Response } from 'express'
import { Router } from "express";
import { container } from "tsyringe";
import { IInboxWebHookController, IPaymentController } from "@/controllers";
import { asyncHandler } from '@/utils/async-handler-util';
import { verifyMetaSignature } from '@/middlewares/meta-webhook';

export const createMetaWebHookRoutes = (): Router => {
  const router = Router();
  const inboxWebHookController = container.resolve<IInboxWebHookController>('InboxWebHookController')

  router.get("/meta/instagram", inboxWebHookController.handleMetaWebHookVerification);
  router.post("/meta/instagram",verifyMetaSignature ,asyncHandler(inboxWebHookController.handleMetaWebHook));

// processWebhookQueue();


  
  return router;
};
