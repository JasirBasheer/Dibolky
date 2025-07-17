import { 
    Request, 
    Response
} from 'express';

/** Interface for Admin Controller */
export interface IAdminController {
    verifyAdmin(req: Request, res: Response): Promise<void>
    recentClients(req: Request, res: Response): Promise<void>
    getClient(req: Request, res: Response): Promise<void>
    getAllClients(req: Request, res: Response): Promise<void>
}
