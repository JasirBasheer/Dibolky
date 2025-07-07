import { Express } from "express";
import { createAdminRoutes, createAgencyRoutes, createAuthRoutes, createClientRoutes, createEntityRoutes, createHealthRoutes, createInfluencerRoutes, createMangerRoutes, createPaymentRouter, createPublicRoutes } from "@/routes";

export const registerRoutes = (app: Express) => {
  app.use("/api/health", createHealthRoutes());
  app.use("/api/public",createPublicRoutes())
  app.use("/api/auth", createAuthRoutes());
  app.use("/api/entities", createEntityRoutes());
  app.use("/api/admin", createAdminRoutes());
  app.use("/api/payment", createPaymentRouter());
  app.use("/api/agency", createAgencyRoutes());
  app.use("/api/client", createClientRoutes());
  app.use("/api/influencer", createInfluencerRoutes());
  app.use("/api/manager", createMangerRoutes());
};