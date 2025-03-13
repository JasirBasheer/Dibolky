import { IRazorpayOrder, IUserDetails } from "../../types/payment.types";

export interface IPaymentService {
    razorpay(details: {amount : number ; currency:string}): Promise<IRazorpayOrder>;
    stripe(details: IUserDetails,success_url:string,cancel_url:string):Promise<string>;
    stripeWebhook(details: Buffer | string,sig:string):Promise<boolean>;
}