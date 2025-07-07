import { Router } from "express";
import { container } from "tsyringe";
import { IPaymentController } from "@/controllers";
import { asyncHandler } from "@/utils/async-handler-util";

export const createRazorpayRoutes = (): Router => {
  const router = Router();

  const paymentController =
    container.resolve<IPaymentController>("PaymentController");
    
  router.post("/", asyncHandler(paymentController.razorpay));

  return router;
};
