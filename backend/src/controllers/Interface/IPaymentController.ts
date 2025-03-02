import { 
    NextFunction, 
    Request, 
    Response 
} from 'express';

/** Interface for Payment Controller */
export interface IPaymentController {
    razorpay(req: Request, res: Response, next: NextFunction): Promise<void>
    stripe(req: Request, res: Response, next: NextFunction): Promise<void>
    stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void>
}
