import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { requestLogger } from "@/middlewares";
import { limiter } from "mern.common";
import { createMetaWebHookRoutes, createPaymentWebHookRoutes } from "@/routes";


export const createApp = () => {
  const app = express();

  app.use(cors({
      origin: ["http://localhost:5173","http://frontend:5173"],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
  }))
  app.use('/api/payment/webhook', createPaymentWebHookRoutes()); 
  app.use('/api/inbox/webhook', createMetaWebHookRoutes()); 
  app.use(helmet());
  // app.use(limiter);
  app.use(compression());
  app.use(express.json());
  app.use(requestLogger);
  app.use(cookieParser());
  return app;
};
