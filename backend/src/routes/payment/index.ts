import { Router } from "express";
import { createStripeRoutes } from "./stripe-routes";
import { createRazorpayRoutes } from "./razorpay-routes";
import { createWebHookRoutes } from "./webhook-routes";

export const createPaymentRouter = () => {
    const router = Router();
    router.use("/stripe", createStripeRoutes());
    router.use("/razorpay", createRazorpayRoutes());
    router.use("/webhook", createWebHookRoutes());
    return router
}
