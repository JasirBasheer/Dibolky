import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db'
import adminRoute from './routes/adminRoutes'
import agencyRoute from './routes/agencyRoutes'
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())



app.use('/api/admin',adminRoute)
app.use('/api/agency',agencyRoute)
// app.use('/api/client')
// app.use('/api/employee')
// app.use('/api/company')

app.get('/', (req, res) => {
    res.send("Backend is running!");
});




connectDB()
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})