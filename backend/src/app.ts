import "reflect-metadata";
import "./config/tsyring.config"
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import http from "http";
import router from './routes/routes';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import { DB_URI, PORT } from "./config/env.config";
import { limiter } from 'mern.common';
import { startScheduledPostsProcessor } from "./media.service/scheduled-posts.service";
import { clearErrorLogsJob, errorLogger } from "./utils/logger.utils";
import initializeSocket from "./utils/socket.utils";
import logger from "./logger";
import { errorHandler } from "./middlewares/errorHandler";
import { connectToMongoDB } from "./utils/mongodb-connection.utils";

dotenv.config();
const app = express()

// app.use(limiter)
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://frontend:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(compression());
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`App log ${duration}ms`,{method:req.method,path:req.originalUrl,status:res.statusCode});
  });
  next();
});

app.use(cookieParser())
// app.use(errorLogger)

app.use('/api/', router)

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});


connectToMongoDB(DB_URI)
// app.use(errorHandler);

// Cron Jobs
clearErrorLogsJob()
startScheduledPostsProcessor()
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    status: res.statusCode || 500,
    hostname: 'mern-backend',
  });
  res.status(500).send('Internal Server Error');
});

const server = http.createServer(app)
initializeSocket(server)


server.listen(PORT || 5000, () => {
    logger.info(`http://localhost:${PORT || 5000}`);
})