import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin/adminController';
import { TokenMiddleWare } from '../middlewares/tokenMiddleware';

router.get('/',TokenMiddleWare,adminController.verifyAdmin)
router.get('/recent-clients',adminController.recentClients)
router.post('/create-agency', adminController.registerAgency)
router.post('/create-company', adminController.registerCompany)

export default router;
