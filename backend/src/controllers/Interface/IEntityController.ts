import { NextFunction, Request, Response } from 'express';

/** Interface for Entity Controller */
export interface IEntityController {
    checkMail(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>
    getPlan(req: Request, res: Response, next: NextFunction): Promise<void>
    registerAgency(req: Request, res: Response, next: NextFunction): Promise<void>
    registerCompany(req: Request, res: Response, next: NextFunction): Promise<void>
    getMenu(req: Request, res: Response, next: NextFunction): Promise<void>
    getCountry(req: Request, res: Response, next: NextFunction): Promise<void>
    createDepartment(req: Request, res: Response, next: NextFunction): Promise<void>
    createEmployee(req: Request, res: Response, next: NextFunction): Promise<void>
    getDepartments(req: Request, res: Response, next: NextFunction): Promise<void>
    getEmployees(req: Request, res: Response, next: NextFunction): Promise<void>
    getOwner(req: Request, res: Response, next: NextFunction): Promise<void>
    getChats(req: Request, res: Response, next: NextFunction): Promise<void>
    getChat(req: Request, res: Response, next: NextFunction): Promise<void>
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>
    createGroup(req: Request, res: Response, next: NextFunction): Promise<void>
}