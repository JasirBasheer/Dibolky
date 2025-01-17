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
}
