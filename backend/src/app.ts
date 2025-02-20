import "reflect-metadata";
import "./config/container"
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import http from "http";
import router from './routes/routes';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import { DB_URI, PORT } from "./config/env";
import { connectToMongoDB, errorHandler, limiter } from 'mern.common';
import { clearErrorLogsJob, errorLogger, logStream } from "./shared/utils/logger";
import { startScheduledPostsProcessor } from "./media.service/scheduled-posts.service";
import initializeSocket from "./shared/utils/socket";

dotenv.config();

const app = express()

// app.use(limiter)
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(compression());
app.use(morgan('dev'))
app.use(cookieParser())
app.use(errorLogger)

app.use('/api/', router)

app.get('/', (req, res) => {
    res.send("Backend is running!");
});

connectToMongoDB(DB_URI || "mongodb://localhost:27017/dibolky")
app.use(errorHandler);

// Cron Jobs
clearErrorLogsJob()
startScheduledPostsProcessor()

const server = http.createServer(app)
initializeSocket(server)

server.listen(PORT || 5000, () => {
    console.log(`http://localhost:${PORT || 5000}`);
})