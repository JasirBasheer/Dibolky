import { NextFunction, Request, Response } from 'express';

export interface IAgencyController {
    getAgency(req: Request, res: Response, next: NextFunction): Promise<any>
    createClient(req: Request, res: Response, next:NextFunction): Promise<void>
    getAllClients(req:Request,res:Response,next:NextFunction):Promise<void>
    getClient(req:Request,res:Response,next:NextFunction):Promise<void>
    uploadContent(req:Request,res:Response,next:NextFunction):Promise<void>
    
}
