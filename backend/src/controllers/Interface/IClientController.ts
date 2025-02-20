import { NextFunction, Request, Response } from 'express';

export interface IClientController {
    getClient(req: Request, res: Response, next: NextFunction): Promise<void>
    getClientDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
}
