import express from 'express';
const router = express.Router();
import { container } from 'tsyringe';
import { IPaymentController } from '../controllers/Interface/IPaymentController';

//Controllers
const paymentController = container.resolve<IPaymentController>('PaymentController')

// Post Requests
router.post('/razorpay',(req, res, next) =>paymentController.razorpay(req,res,next))
router.post('/stripe',(req, res, next) =>paymentController.stripe(req,res,next))
router.post('/stripe-webhook',(req,res,next) =>paymentController.stripeWebhook(req,res,next))

export default router;
