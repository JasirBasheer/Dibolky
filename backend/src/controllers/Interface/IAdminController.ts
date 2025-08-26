import { 
    Request, 
    Response
} from 'express';

export interface IAdminController {
    verifyAdmin(req: Request, res: Response): Promise<void>
}
