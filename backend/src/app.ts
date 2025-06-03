import "reflect-metadata";
import "./config/tsyring.config"
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import http from "http";
import router from './routes/routes';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import { DB_URI, PORT } from "./config/env.config";
import { connectToMongoDB, errorHandler, limiter } from 'mern.common';
import { startScheduledPostsProcessor } from "./media.service/scheduled-posts.service";
import { clearErrorLogsJob, errorLogger } from "./utils/logger.utils";
import initializeSocket from "./utils/socket.utils";

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
app.use(morgan('dev'))
app.use(cookieParser())
app.use(errorLogger)

app.use('/api/', router)

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

connectToMongoDB(DB_URI)
app.use(errorHandler);

// Cron Jobs
clearErrorLogsJob()
startScheduledPostsProcessor()

const server = http.createServer(app)
initializeSocket(server)

server.listen(PORT || 5000, () => {
    console.log(`http://localhost:${PORT || 5000}`);
})