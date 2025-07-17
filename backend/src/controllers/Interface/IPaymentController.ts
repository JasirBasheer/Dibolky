import { 
    Request, 
    Response 
} from 'express';

/** Interface for Payment Controller */
export interface IPaymentController {
    razorpay(req: Request, res: Response): Promise<void>
    stripe(req: Request, res: Response): Promise<void>
    stripeWebhook(req: Request, res: Response): Promise<void>
}
