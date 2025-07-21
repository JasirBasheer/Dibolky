import { IRazorpayOrder, IUserDetails } from "../../types/payment";

export interface IPaymentService {
    razorpay(details: {amount : number ; currency:string},key_id:string,key_secret:string): Promise<IRazorpayOrder>;
    stripe(details: IUserDetails,success_url:string,cancel_url:string):Promise<string>;
    stripeWebhook(details: Buffer | string,sig:string):Promise<boolean>;
}