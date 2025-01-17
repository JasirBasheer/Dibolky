import { NextFunction, Request, Response } from 'express';

export interface IAdminController {
    verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void>
    recentClients(req: Request, res: Response, next:NextFunction): Promise<void>
    getClient(req: Request, res: Response, next:NextFunction): Promise<void>
    getAllClients(req: Request, res: Response, next:NextFunction): Promise<void>
}
