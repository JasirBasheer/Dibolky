import "reflect-metadata";
import dotenv from 'dotenv';
dotenv.config();
import { registerRoutes } from "./app/registerRoutes";
import { registerDependencies } from "@/di";
import { errorHandler, socketAuthMiddleware } from "@/middlewares";
import { registerSocketEventHandlers } from "./app/socketHandlers";
import { PORT, connectRedis } from "@/config";
import { startCronJobs } from "./infrastructure/cron/startCronJobs";
import { createApp } from "@/app";
import { connectDB } from "@/utils";
import logger from "@/logger";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config/socket";


async function bootstrap() {
  try {
    await connectDB()
    await connectRedis();
    registerDependencies();
    startCronJobs();
    
    const app = createApp(); 
    registerRoutes(app);
    app.use(errorHandler);
    
    const server = http.createServer(app);
    const io = new Server(server, config.socketOptions);
    io.use(socketAuthMiddleware);
    
    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      registerSocketEventHandlers(io, socket);
    });


    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error caught by bootstrap : ',err)
    logger.error("Bootstrapping failed:", err);
    process.exit(1);
  }
}

bootstrap();
