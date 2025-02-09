import { 
  NextFunction, 
  Request, 
  Response 
} from 'express';

/** Interface for Authentication Controller */
export interface IAuthenticationController {
  login(req: Request, res: Response, next:NextFunction): Promise<void>
  forgotPassword(req: Request, res: Response, next:NextFunction): Promise<void>
  resetPassword(req: Request, res: Response, next:NextFunction): Promise<void>
  logout(req: Request, res: Response, next:NextFunction): Promise<void>
}
