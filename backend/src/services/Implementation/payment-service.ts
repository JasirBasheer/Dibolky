import Stripe from "stripe";
import { stripe } from "../../config/stripe.config";
import { IRazorpayOrder, IUserDetails } from "../../types/payment";
import { IPaymentService } from "../Interface/IPaymentService";
import { inject, injectable } from "tsyringe";
import { IEntityService } from "../Interface/IEntityService";
import razorpayInstance from "../../config/razorpay.config";

@injectable()
export class PaymentService implements IPaymentService {
    private _entityService:IEntityService
    constructor(
        @inject('EntityService')entityService:IEntityService
    ){
        this._entityService  = entityService

    }

    async razorpay(
        details: { amount: number; currency: string }
    ): Promise<IRazorpayOrder> {
        const { amount, currency } = details;
        const options = {
            amount: amount * 100,
            currency: currency || 'INR',
        };

        const order = await razorpayInstance.orders.create(options);
        return order as IRazorpayOrder
    }
    async stripe(
        details: IUserDetails,
        success_url: string, 
        cancel_url: string
    ): Promise<string> {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [{
                    price_data: {
                        currency: details.currency.toLowerCase(),
                        product_data: {
                            name: details.name,
                        },
                        unit_amount: details?.plan?.price * 100,
                    },
                    quantity: details.validity,
                }],
                success_url,
                cancel_url,
                metadata: {
                    ...details,
                    plan: JSON.stringify(details.plan)
                }
            })

            return session.url as string

        } catch (error) {
            throw error
        }
    }


    async stripeWebhook(
        details: Buffer | string, 
        sig: string
    ): Promise<boolean> {
        try {
            let event: Stripe.Event;
            event = stripe.webhooks.constructEvent(details, sig, "whsec_cae33044573115c56711a0bacaf0e229d72fbadd3301a0fc3f8bafe6c4093fe3");
            console.log('Received Stripe event:', event.type);

            if (event.type == 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};

                await this._entityService.createAgency({
                    organizationName:metadata.organizationName, name:metadata.name, email:metadata.email,
                    address:{ city: metadata.city, country: metadata.country }, websiteUrl:metadata.website,
                    industry:metadata.industry,contactNumber:Number(metadata.phone), logo:metadata.logo || "",
                    password:metadata.password, planId:JSON.parse(metadata.plan)._id, validity:Number(metadata.validity),
                    planPurchasedRate:Number(metadata.amount),transactionId: session.payment_intent as string || session.id as string, 
                    paymentGateway:"Stripe", description:metadata.description, currency:metadata.currency
                })
                return true
            }
            return false

        } catch (error) {
            throw error
        }
    }
}

