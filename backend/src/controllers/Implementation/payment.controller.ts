import { NextFunction, Request, Response } from 'express';
import { IPaymentController } from '../Interface/IPaymentController';
import { inject, injectable } from 'tsyringe';
import { IPaymentService } from '../../services/Interface/IPaymentService';
import { stripe } from '../../config/stripe';
import Stripe from 'stripe';
import { IEntityService } from '../../services/Interface/IEntityService';
import { 
    HTTPStatusCodes, 
    ResponseMessage, 
    SendResponse 
} from 'mern.common';
import { IUserDetails } from '../../shared/types/payment.types';

@injectable()
/** Implementation of Payment Controller */
export default class PaymentController implements IPaymentController {
    private paymentService: IPaymentService;
    private entityService: IEntityService;

    /**
    * Initializes the AuthenticationController with required service dependencies.
    * @param paymentService - Service for general paymet operations.
    * @param entityService - Service for general entity operations.
    */
    constructor(
        @inject('EntityService') entityService: IEntityService,
        @inject('PaymentService') paymentService: IPaymentService
    ) {
        this.paymentService = paymentService
        this.entityService = entityService
    }


    /**
    * Initiates a Razorpay payment session with the specified amount.
    * @param req Express Request object containing the payment amount
    * @param res Express Response object containing the payment session data
    * @param next Express NextFunction for error handling
    * @returns Promise<void> Resolves to a response with payment session data
    */
    async razorpay(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { amount , currency }: { amount: number, currency:string } = req.body

            const response = await this.paymentService.razorpay({ amount, currency})
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.CREATED, { data: response })
        } catch (error) {
            console.error('Error creating company:', error);
            next(error)

        }
    }


    /**
     * Initiates a Stripe payment session and returns the payment URL.
     * @param req Express Request object containing the payment details, success URL, and cancel URL
     * @param res Express Response object containing the Stripe session URL
     * @param next Express NextFunction for error handling
     * @returns Promise<void> Resolves to a response with a payment URL
     */
    async stripe(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { details, success_url, cancel_url } = req.body

            const session = await this.paymentService.stripe(details, success_url, cancel_url)
            res.json({ url: session })
        } catch (error) {
            next(error)
        }
    }


    /**
     * Handles incoming Stripe webhook events and processes the 'checkout.session.completed' event to register a new agency.
     * @param req Express Request object
     * @param res Express Response object
     * @param next Express NextFunction for error handling
     * @returns Promise<void> Resolves to void
     */
    async stripeWebhook(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const sig = req.headers['stripe-signature'] as string;
            const response = await this.paymentService.stripeWebhook(req.body,sig)
            if(response)SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.CREATED)
            
        } catch (error) {
            next(error)
        }
    }


}


