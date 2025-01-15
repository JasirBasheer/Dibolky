import express from 'express';
import paymentController from '../controllers/payment/paymentController';
const router = express.Router();


router.post('/razorpay',paymentController.razorpay)

export default router;
