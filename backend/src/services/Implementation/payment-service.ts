import Stripe from "stripe";
import { stripe } from "../../config/stripe.config";
import { IRazorpayOrder, IUserDetails } from "../../types/payment";
import { IPaymentService } from "../Interface/IPaymentService";
import { inject, injectable } from "tsyringe";
import { createRazorpayInstance } from "@/config/razorpay.config";
import { env } from "@/config";
import { IAgencyService, IPlanService } from "../Interface";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject("AgencyService")private readonly _agencyService: IAgencyService,
    @inject("PlanService")private readonly _planService: IPlanService
  ) {}
   

  async razorpay(
    details: { amount: number; currency: string },
    key_id: string,
    key_secret: string
  ): Promise<IRazorpayOrder> {
    const { amount, currency } = details;
    const options = {
      amount: amount * 100,
      currency: currency || "INR",
    };
    const razorpayInstance = createRazorpayInstance(key_id, key_secret);
    const order = await razorpayInstance.orders.create(options);
    return {
      ...order,
      key_id,
    } as IRazorpayOrder;
  }

  async stripe(
    details: IUserDetails,
    success_url: string,
    cancel_url: string
  ): Promise<string> {
    try {
      const plan = await this._planService.getPlan(details?.planId)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: details.name,
              },
              unit_amount: plan.price * 100,
            },
            quantity: details.validity,
          },
        ],
        success_url,
        cancel_url,
        metadata: {
          ...details,
                },
      });

      return session.url as string;
    } catch (error) {
      throw error;
    }
  }

  async stripeWebhook(details: Buffer | string, sig: string): Promise<boolean> {
    try {
      console.log("stripe debug 1");

      let event: Stripe.Event;
      event = stripe.webhooks.constructEvent(
        details,
        sig,
        env.STRIPE.WEBHOOK_SECRET
      );

      console.log("stripe debug 2");

      switch (event.type) {
        case "checkout.session.completed": {
          console.log("Checkout session completed");
          const session = event.data.object as Stripe.Checkout.Session;
          const metadata = session.metadata || {};
          const plan = await this._planService.getPlan(metadata.planId)


          await this._agencyService.createAgency({
            organizationName: metadata.organizationName,
            name: metadata.name,
            email: metadata.email,
            address: { city: metadata.city, country: metadata.country },
            websiteUrl: metadata.website,
            industry: metadata.industry,
            contactNumber: metadata.phone,
            logo: metadata.logo || "",
            password: metadata.password,
            planId: plan.id,
            validity: Number(metadata.validity),
            planPurchasedRate: Number(metadata.amount),
            transactionId:
              (session.payment_intent as string) || (session.id as string),
            paymentGateway: "Stripe",
            description: metadata.description,
            currency: metadata.currency,
          });
          return true;
        }

        case "payment_intent.succeeded":
          console.log("Payment intent succeeded");
          return true;

        default:
          console.log(` Unhandled event type: ${event.type}`);
          return false;
      }
    } catch (error) {
      throw error;
    }
  }
}
