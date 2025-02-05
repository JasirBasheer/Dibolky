
export interface IPaymentService {
    razorpay(details: any):Promise<any>;
    stripe(details: any,success_url:string,cancel_url:string):Promise<any>;

}