import { Router } from "express";
import { createStripeRoutes } from "./stripe-routes";
import { createRazorpayRoutes } from "./razorpay-routes";
import { createWebHookRoutes } from "./webhook-routes";

export const createPaymentRouter = () => {
    const router = Router();
    router.use("/webhook", createWebHookRoutes());
    router.use("/razorpay", createRazorpayRoutes());
    router.use("/stripe", createStripeRoutes());
    return router
}
