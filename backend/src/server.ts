import "reflect-metadata";
import dotenv from 'dotenv';
dotenv.config();
import { registerRoutes } from "./app/registerRoutes";
import { registerDependencies } from "@/di";
import { errorHandler } from "@/middlewares";
import { createApp } from "@/app";
import { connectDB } from "@/utils";
import logger from "@/logger";
import { PORT, connectRedis } from "@/config";

async function bootstrap() {
  try {
    await connectDB()
    await connectRedis();
    registerDependencies();
    
    const app = createApp(); 
    registerRoutes(app);
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error caught by bootstrap : ',err)
    logger.error("Bootstrapping failed:", err);
    process.exit(1);
  }
}

bootstrap();
