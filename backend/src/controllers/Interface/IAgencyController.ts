import {
    NextFunction,
    Request,
    Response
} from 'express';

export interface IAgencyController {
    getAgency(req: Request, res: Response, next: NextFunction): Promise<void>
    getAgencyOwnerDetails(req: Request, res: Response, next: NextFunction): Promise<void>
    createClient(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllClients(req: Request, res: Response, next: NextFunction): Promise<void>
    getClient(req: Request, res: Response, next: NextFunction): Promise<void>
    uploadContent(req: Request, res: Response, next: NextFunction): Promise<void>
    getAvailableUsers(req: Request, res: Response, next: NextFunction): Promise<void>
    getProjectsCount(req: Request, res: Response, next: NextFunction): Promise<void>
    getClientsCount(req: Request, res: Response, next: NextFunction): Promise<void>
    editProjectStatus(req: Request, res: Response, next: NextFunction): Promise<void>
    getInitialSetUp(req: Request, res: Response, next: NextFunction): Promise<void>
    IntegratePaymentGateWay(req: Request, res: Response, next: NextFunction): Promise<void>
    getPaymentIntegrationStatus(req: Request, res: Response, next: NextFunction): Promise<void>
}
