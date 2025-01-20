import express from 'express';
const router = express.Router();
import { container } from 'tsyringe';
import { IPaymentController } from '../../controllers/Interface/IPaymentController';

const paymentController = container.resolve<IPaymentController>('PaymentController')

router.post('/razorpay',(req, res, next) =>paymentController.razorpay(req,res,next))

export default router;
