import PaymentService from '../../services/payment/paymentService'
import { NextFunction, Request, Response } from 'express';

class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
        this.razorpay = this.razorpay.bind(this)
    }
    
    async razorpay(req:Request,res:Response, next:NextFunction):Promise<any>{
        try {
            const {amount, currency} = req.body
            const response = await this.paymentService.razorpay({amount, currency})
            console.log(response);
            
            return res.status(200).json({data:response})
        } catch (error) {
            console.error('Error creating company:', error);
            next(error)

        }
    }


}


export default new PaymentController()