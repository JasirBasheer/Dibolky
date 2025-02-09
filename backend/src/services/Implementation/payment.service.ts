import { stripe } from "../../config/stripe";
import razorpayInstance from "../../shared/utils/razorpay";
import { IPaymentService } from "../Interface/IPaymentService";

export default class PaymentService implements IPaymentService {

    async razorpay(details: any): Promise<any> {
        const { amount, currency } = details;
            const options = {
                amount: amount * 100,
                currency: currency || 'INR',
            };

            const order = await razorpayInstance.orders.create(options);
            return order
    }
    async stripe(details: any,success_url:string,cancel_url:string):Promise<any>{        
        try {
            console.log(details,"details")
            console.log("details=plan",details.plan)
         const { menu,features,name, ...planWithoutMenu } = details.plan;
         const session = await stripe.checkout.sessions.create({
            payment_method_types :["card"],
            mode:"payment",
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
            metadata:{
                ...details,
                plan: JSON.stringify(planWithoutMenu)
            }
        })
        return session
                   
    } catch (error) {
            throw error
    }
    }
}
