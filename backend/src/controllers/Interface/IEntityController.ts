import { NextFunction, Request, Response } from 'express';

export interface IEntityController {
    checkMail(req: Request, res: Response, next: NextFunction): Promise<any>
    getAllPlans(req: Request, res: Response, next: NextFunction): Promise<any>
    getPlan(req: Request, res: Response, next: NextFunction): Promise<any>
    registerAgency(req: Request, res: Response, next: NextFunction): Promise<any>
    registerCompany(req: Request, res: Response, next: NextFunction): Promise<any>
    getMenu(req: Request, res: Response, next: NextFunction): Promise<any>
    getCountry(req: Request, res: Response, next: NextFunction): Promise<any>
}
