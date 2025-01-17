import "reflect-metadata";
import "./config/container"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan'
import compression from 'compression';
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import router from './routes/route';
import limiter from './shared/utils/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
dotenv.config();

const app = express()

app.use(limiter)
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(compression());
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())


app.use('/api/',router)

app.get('/', (req, res) => {
    res.send("Backend is running!");
});

connectDB()
app.use(errorHandler);


app.listen(process.env.PORT || 5000,()=>{
    console.log(`http://localhost:${process.env.PORT || 5000}`);
})