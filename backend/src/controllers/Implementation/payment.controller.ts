import { NextFunction, Request, Response } from 'express';
import { IPaymentController } from '../Interface/IPaymentController';
import { inject, injectable } from 'tsyringe';
import { IPaymentService } from '../../services/Interface/IPaymentService';
import { HTTPStatusCodes, ResponseMessage, SendResponse } from 'mern.common';
import { stripe } from '../../config/stripe';
import Stripe from 'stripe';
import { IEntityService } from '../../services/Interface/IEntityService';

@injectable()
export default class PaymentController implements IPaymentController {
    private paymentService: IPaymentService;
    private entityService: IEntityService;
    

    constructor(
        @inject('EntityService') entityService : IEntityService,
        @inject('PaymentService') paymentService: IPaymentService
    ) {
        this.paymentService = paymentService
        this.entityService = entityService
    }

    async razorpay(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { amount } = req.body
            const response = await this.paymentService.razorpay({ amount })
            console.log(response);
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.CREATED, { data: response })
        } catch (error) {
            console.error('Error creating company:', error);
            next(error)

        }
    }

    async stripe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { details, success_url, cancel_url } = req.body
            const session = await this.paymentService.stripe(details, success_url, cancel_url)
            res.json({ url: session.url })
        } catch (error) {
            console.error('Error creating company:', error);
            next(error)

        }
    }

    async stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<any> {
        console.log('Webhook called');
        console.log('signature', req.headers);
        const sig = req.headers['stripe-signature'] as string;
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, "whsec_cae33044573115c56711a0bacaf0e229d72fbadd3301a0fc3f8bafe6c4093fe3" as string);
            console.log(event, 'event');

            if(event.type == 'checkout.session.completed'){
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};
                console.log('Session Metadata:', metadata);

               const response =  await this.entityService.registerAgency(metadata.organizationName,metadata.name,metadata.email,metadata.address,metadata.website,metadata.industry,
                                                        Number(metadata.phone),metadata.logo ||"",metadata.password,JSON.parse(metadata.plan)._id,Number(metadata.validity),
                                                        Number(metadata.amount),"2342saf","Stripe",metadata.description,metadata.currency)
                if(response)return true
            }

        } catch (error) {
            console.log(error)
        }
    }


}


