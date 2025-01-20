import "reflect-metadata";
import "./config/container"
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan'
import compression from 'compression';
import cookieParser from 'cookie-parser'
import router from './routes/route';
import { connectToMongoDB, errorHandler, limiter } from 'mern.common';
dotenv.config();

const app = express()

app.use(limiter)
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
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

connectToMongoDB(process.env.DB_URI || "mongodb://localhost:27017/dibolky")
app.use(errorHandler);


app.listen(process.env.PORT || 5000,()=>{
    console.log(`http://localhost:${process.env.PORT || 5000}`);
})