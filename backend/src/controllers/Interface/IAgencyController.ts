import { NextFunction, Request, Response } from 'express';

export interface IAgencyController {
    getAgency(req: Request, res: Response, next: NextFunction): Promise<any>
    createClient(req: Request, res: Response, next:NextFunction): Promise<void>
}
