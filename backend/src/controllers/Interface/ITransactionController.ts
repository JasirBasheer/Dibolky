import { 
    Request, 
    Response
} from 'express';

export interface ITransactionController {
    getTransactions(req: Request, res: Response): Promise<void>
}
