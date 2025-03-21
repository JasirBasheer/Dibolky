import "reflect-metadata";
import express from 'express';
import adminRoutes from './admin.routes'
import agencyRoutes from './agency.routes'
import paymentRoutes from './payment.routes'
import authRoutes from './authentication.routes'
import entityRoutes from './entity.routes'
import clientRoutes from './client.routes'
import influencerRoutes from './influencer.routes'
import managerRoutes from './manager.routes'
import { TokenMiddleWare } from '../middlewares/token.middleware';

const router = express.Router();

router.use("/payment/webhooks", express.raw({ type: "application/json" }), paymentRoutes);
router.use(express.json())

router.use('/auth',authRoutes)
router.use('/entities',entityRoutes)
router.use('/payment',paymentRoutes)
router.use('/admin',TokenMiddleWare,adminRoutes) 
router.use('/agency',TokenMiddleWare,agencyRoutes)
router.use('/client',TokenMiddleWare,clientRoutes)
router.use('/influencer',TokenMiddleWare,influencerRoutes)
router.use('/manager',TokenMiddleWare,managerRoutes)

export default router;
