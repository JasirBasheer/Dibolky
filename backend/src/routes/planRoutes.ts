import express from 'express';
const router = express.Router()
import adminController from '../controllers/admin/adminController';

router.get('/get-all-plans', adminController.getAllPlans)
router.post('/get-plan', adminController.getPlan)
router.post('/check-mail',adminController.checkMail)
router.get('/:role/:planId', adminController.getMenu);

export default router