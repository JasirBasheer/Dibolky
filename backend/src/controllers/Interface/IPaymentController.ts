import { NextFunction, Request, Response } from 'express';

export interface IPaymentController {
    razorpay(req: Request, res: Response, next: NextFunction): Promise<any>
    stripe(req: Request, res: Response, next: NextFunction): Promise<any>
    stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<any>
}
