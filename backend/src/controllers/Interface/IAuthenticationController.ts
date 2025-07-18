import { 
  Request, 
  Response 
} from 'express';

/** Interface for Authentication Controller */
export interface IAuthenticationController {
  login(req: Request, res: Response): Promise<void>
  forgotPassword(req: Request, res: Response): Promise<void>
  resetPassword(req: Request, res: Response): Promise<void>
  logout(req: Request, res: Response): Promise<void>
}
