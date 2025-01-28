import { NextFunction, Request, Response } from 'express';

export interface IClientController {
    getClient(req: Request, res: Response, next: NextFunction): Promise<any>
}
