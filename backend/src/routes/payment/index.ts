import { Router } from "express";
import { createStripeRoutes } from "./stripe-routes";
import { createRazorpayRoutes } from "./razorpay-routes";

export const createPaymentRouter = () => {
    const router = Router();
    router.use("/razorpay", createRazorpayRoutes());
    router.use("/stripe", createStripeRoutes());
    return router
}
