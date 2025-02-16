import { NextFunction, Request, Response } from 'express';

export interface IEmployeeController {
    getEmployee(req: Request, res: Response, next: NextFunction): Promise<void>
}
