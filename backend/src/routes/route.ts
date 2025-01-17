import "reflect-metadata";
import express from 'express';
import adminRoutes from './admin/adminRoutes'
import agencyRoutes from './organizations/agency/agencyRoutes'
import paymentRoutes from './payment/paymentRoutes'
import authRoutes from './auth/authenticationRoutes'
import entityRoutes from './entity/entityRoutes'
import clientRoutes from './organizations/client/clientRoutes'
import employeeRoutes from './organizations/employee/employeeRoutes'
import companyRoutes from './organizations/company/companyRoutes'
import { TokenMiddleWare } from '../middlewares/tokenMiddleware';

const router = express.Router();

router.use('/api/auth',authRoutes)
router.use('/api/entities',entityRoutes)
router.use('/api/admin',adminRoutes)
router.use('/api/agency',TokenMiddleWare,agencyRoutes)
router.use('/api/payment',paymentRoutes)
router.use('/api/client',clientRoutes)
router.use('/api/employee',employeeRoutes)
router.use('/api/company',companyRoutes)

export default router;
