import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import adminRoutes from './routes/adminRoutes'
import agencyRoutes from './routes/agencyRoutes'
import paymentRoutes from './routes/paymentRoutes'
import authRoutes from './routes/authenticationRoutes'
import planRoutes from './routes/planRoutes'
import clientRoutes from './routes/clientRoutes'
import employeeRoutes from './routes/employeeRoutes'
import companyRoutes from './routes/companyRoutes'
import { errorHandler } from './middlewares/errorHandler';
import { TokenMiddleWare } from './middlewares/tokenMiddleware';
dotenv.config();

const app = express()

app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials:true
}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())

app.use('/api/plan',planRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/agency',TokenMiddleWare,agencyRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/client',clientRoutes)
app.use('/api/employee',employeeRoutes)
app.use('/api/company',companyRoutes)

app.get('/', (req, res) => {
    res.send("Backend is running!");
});




connectDB()
const PORT = process.env.PORT || 5000

app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})