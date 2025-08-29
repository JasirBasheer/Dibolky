import { Router } from "express";
import { createRazorpayRoutes } from "./razorpay";
import { createStripeRoutes } from "./stripe";

export const createPaymentRouter = () => {
    const router = Router();
    router.use("/razorpay", createRazorpayRoutes());
    router.use("/stripe", createStripeRoutes());
    return router
}
