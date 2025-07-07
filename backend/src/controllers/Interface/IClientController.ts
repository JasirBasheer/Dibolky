import { 
    Request, 
    Response 
} from 'express';

export interface IClientController {
    getClient(req: Request, res: Response): Promise<void>
    getClientDetails(req: Request, res: Response): Promise<void>;
    getOwner(req: Request, res: Response): Promise<void>;
}
