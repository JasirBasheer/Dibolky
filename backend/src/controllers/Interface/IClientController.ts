import { 
    Request, 
    Response 
} from 'express';

export interface IClientController {
    getClient(req: Request, res: Response): Promise<void>
    getClientDetails(req: Request, res: Response): Promise<void>;
    getOwner(req: Request, res: Response): Promise<void>;
    initiateRazorpayPayment(req: Request, res: Response): Promise<void>;
    verifyInvoicePayment(req: Request, res: Response): Promise<void>;
}
