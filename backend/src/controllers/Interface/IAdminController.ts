import { 
    NextFunction,
    Request, 
    Response
} from 'express';

/** Interface for Admin Controller */
export interface IAdminController {
    verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void>
    recentClients(req: Request, res: Response, next:NextFunction): Promise<void>
    getClient(req: Request, res: Response, next:NextFunction): Promise<void>
    getAllClients(req: Request, res: Response, next:NextFunction): Promise<void>
    
    // plan-management
    createPlan(req: Request, res: Response, next:NextFunction): Promise<void>
    editPlan(req: Request, res: Response, next:NextFunction): Promise<void>
    changePlanStatus(req: Request, res: Response, next:NextFunction): Promise<void>
    getPlan(req: Request, res: Response, next:NextFunction): Promise<void>
}
