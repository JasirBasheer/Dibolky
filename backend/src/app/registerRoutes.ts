import { Express } from "express";
import { createAdminRoutes, createAgencyRoutes, createAuthRoutes, createChatRoutes, createClientRoutes, createEntityRoutes, createHealthRoutes, createInboxRoutes, createLeadRoutes, createPaymentRouter, createProjectRoutes, createProviderRoutes, createPublicRoutes, createStorageRoutes } from "@/routes";
import { createShowCaseRoutes } from "@/routes/showcase";

export const registerRoutes = (app: Express) => {
  app.use("/api/", createHealthRoutes());
  app.use("/api/public",createPublicRoutes());
  app.use("/api/auth", createAuthRoutes());
  app.use("/api/admin", createAdminRoutes());
  app.use("/api/agency", createAgencyRoutes());
  app.use("/api/client", createClientRoutes());
  app.use("/api/payment", createPaymentRouter());  
  app.use("/api/entities", createEntityRoutes());
  app.use("/api/storage", createStorageRoutes());
  app.use("/api/provider", createProviderRoutes());
  app.use("/api/project", createProjectRoutes());
  app.use("/api/showcase", createShowCaseRoutes());
  app.use("/api/lead", createLeadRoutes());
  app.use("/api/chat", createChatRoutes());
  app.use("/api/inbox", createInboxRoutes())
};
 