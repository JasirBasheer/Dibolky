import logger from "@/logger";
import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Request log`,{
        method:req.method,
        path:req.originalUrl,
        status:res.statusCode,
        duration:`${duration} ms`,
    });
  });
  next();
};
