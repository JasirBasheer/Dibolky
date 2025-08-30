import { Router } from "express";
import { container } from "tsyringe";
import { IPaymentController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createStripeRoutes = (): Router => {
  const router = Router();
  const paymentController = container.resolve<IPaymentController>('PaymentController')
  router.post('/',asyncHandler(paymentController.stripe))
  
  return router;
};
