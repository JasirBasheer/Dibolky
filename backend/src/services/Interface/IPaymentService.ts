
export interface IPaymentService {
    razorpay(details: any):Promise<any>;
}