import Stripe from "stripe";
import { stripe } from "../../config/stripe.config";
import { IRazorpayOrder, IUserDetails } from "../../types/payment.types";
import { IPaymentService } from "../Interface/IPaymentService";
import { inject, injectable } from "tsyringe";
import { IEntityService } from "../Interface/IEntityService";
import razorpayInstance from "../../config/razorpay.config";

@injectable()
export default class PaymentService implements IPaymentService {
    private entityService:IEntityService
    constructor(
        @inject('EntityService')entityService:IEntityService
    ){
        this.entityService  = entityService

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
            console.log(details, "details")
            console.log("details=plan", details.plan)
            const { menu, features, name, ...planWithoutMenu } = details.plan;
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
                    plan: JSON.stringify(planWithoutMenu)
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

            if (event.type == 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};

                await this.entityService.registerAgency(
                    metadata.organizationName, metadata.name, metadata.email,
                    { city: metadata.city, country: metadata.country, }, metadata.website,
                    metadata.industry, Number(metadata.phone), metadata.logo || "",
                    metadata.password, JSON.parse(metadata.plan)._id, Number(metadata.validity),
                    Number(metadata.amount), "2342saf", "Stripe", metadata.description, metadata.currency
                )
                return true
            }
            return false

        } catch (error) {
            throw error
        }
    }
}

