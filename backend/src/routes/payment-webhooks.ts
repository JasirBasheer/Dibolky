import express from 'express'
import { Router } from "express";
import { container } from "tsyringe";
import { IPaymentController } from "@/controllers";
import { asyncHandler } from '@/utils/async-handler-util';

export const createPaymentWebHookRoutes = (): Router => {
  const router = Router();
  router.use(express.raw({ type: "application/json" }))
  
  const paymentController = container.resolve<IPaymentController>('PaymentController')
  router.post('/stripe',  asyncHandler(paymentController.stripeWebhook))
  
  return router;
};
