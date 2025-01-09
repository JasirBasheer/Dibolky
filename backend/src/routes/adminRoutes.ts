import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController';

router.post('/create-agency', adminController.registerAgency)
router.post('/create-company', adminController.registerCompany)

export default router;
