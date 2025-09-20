import { 
    Request, 
    Response 
} from 'express';

export interface IEntityController {
    getMedia(req: Request, res: Response): Promise<void>
    getAllInvoices(req:Request,res:Response):Promise<void>
    getAllTransactions(req:Request,res:Response):Promise<void>
    getAllActivities(req:Request,res:Response):Promise<void>
    updateProfile(req:Request,res:Response):Promise<void>
    getCalenderEvents(req:Request,res:Response):Promise<void>
}
