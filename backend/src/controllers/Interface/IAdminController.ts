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
    
    // plan-management
    createPlan(req: Request, res: Response): Promise<void>
    editPlan(req: Request, res: Response): Promise<void>
    changePlanStatus(req: Request, res: Response): Promise<void>
    getPlan(req: Request, res: Response): Promise<void>
}
