import { Request, Response } from 'express';
import { IPaymentController } from '../Interface/IPaymentController';
import { inject, injectable } from 'tsyringe';
import { IPaymentService } from '../../services/Interface/IPaymentService';
import { 
    HTTPStatusCodes, 
    ResponseMessage, 
    SendResponse 
} from 'mern.common';

@injectable()
export class PaymentController implements IPaymentController {
    private _paymentService: IPaymentService;

 
    constructor(
        @inject('PaymentService') paymentService: IPaymentService
    ) {
        this._paymentService = paymentService
    }


    razorpay = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { amount , currency }: { amount: number, currency:string } = req.body

            const response = await this._paymentService.razorpay({ amount, currency})
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.CREATED, { data: response })
    }



    stripe = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const { details, success_url, cancel_url } = req.body

            const session = await this._paymentService.stripe(details, success_url, cancel_url)
            res.json({ url: session })
    }

    stripeWebhook = async(
        req: Request,
        res: Response,
    ): Promise<void> => {
            const sig = req.headers['stripe-signature'] as string;
            const response = await this._paymentService.stripeWebhook(req.body,sig)
            if(response)SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.CREATED)
            
    }


}


