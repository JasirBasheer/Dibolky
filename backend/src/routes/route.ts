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
import { TokenMiddleWare } from '../middlewares/token.middleware';

const router = express.Router();

router.use('/auth',authRoutes)
router.use('/entities',entityRoutes)
router.use('/payment',paymentRoutes)
router.use('/admin',TokenMiddleWare,adminRoutes)
router.use('/agency',TokenMiddleWare,agencyRoutes)
router.use('/client',TokenMiddleWare,clientRoutes)
router.use('/employee',TokenMiddleWare,employeeRoutes)
router.use('/company',TokenMiddleWare,companyRoutes)

export default router;
