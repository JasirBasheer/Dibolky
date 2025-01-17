import { NextFunction, Request, Response } from 'express';

export interface IPaymentController {
    razorpay(req: Request, res: Response, next: NextFunction): Promise<any>
}
