import { 
    Request, 
    Response
} from 'express';

/** Interface for Admin Controller */
export interface IAdminController {
    verifyAdmin(req: Request, res: Response): Promise<void>
    getClients(req: Request, res: Response): Promise<void>
    getTransactions(req: Request, res: Response): Promise<void>
    getClient(req: Request, res: Response): Promise<void>
    toggleClientAccess(req: Request, res: Response): Promise<void>
}
