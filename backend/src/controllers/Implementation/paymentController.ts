import { NextFunction, Request, Response } from 'express';
import { IPaymentController } from '../Interface/IPaymentController';
import { inject, injectable } from 'tsyringe';
import { IPaymentService } from '../../services/Interface/IPaymentService';

@injectable()
export default class PaymentController implements IPaymentController {
    private paymentService: IPaymentService;

    constructor(
        @inject('IPaymentSerive') paymentService : IPaymentService
    ) {
        this.paymentService = paymentService
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


