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

router.use('/auth',authRoutes)
router.use('/entities',entityRoutes)
router.use('/admin',TokenMiddleWare,adminRoutes)
router.use('/agency',TokenMiddleWare,agencyRoutes)
router.use('/payment',paymentRoutes)
router.use('/client',clientRoutes)
router.use('/employee',employeeRoutes)
router.use('/company',companyRoutes)

export default router;
