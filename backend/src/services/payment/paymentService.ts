import razorpayInstance from "../../utils/razorpay";

class PaymentService {

    async razorpay(details: any):Promise<any> {
        const { amount, currency } = details;
        console.log(amount)

        try {
            const options = {
                amount: amount * 100,
                currency: currency || 'INR',
            };

            const order = await razorpayInstance.orders.create(options);
            return order
        } catch (error) {
            console.error(error);
            return null
        }

    }
}
export default PaymentService