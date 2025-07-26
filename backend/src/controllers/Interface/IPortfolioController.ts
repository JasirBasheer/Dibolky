import { 
    Request, 
    Response 
} from 'express';

export interface IPortfolioController {
    createPortfolio(req: Request, res: Response): Promise<void>
    getPortfolios(req: Request, res: Response): Promise<void>
    editPortfolio(req: Request, res: Response): Promise<void>
    getAllTestimonials(req: Request, res: Response): Promise<void>
    createTestimonial(req: Request, res: Response): Promise<void>

}
