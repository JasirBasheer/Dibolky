import { NextFunction, Request, Response } from 'express';

export interface IAuthenticationController {
  login(req: Request, res: Response, next:NextFunction): Promise<void>
  forgotPassword(req: Request, res: Response, next:NextFunction): Promise<void>
  resetPassword(req: Request, res: Response, next:NextFunction): Promise<void>
}
