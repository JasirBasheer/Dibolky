import {
    Request,
    Response
} from 'express';

export interface IAgencyController {
    getAgency(req: Request, res: Response): Promise<void>
    getAgencyOwnerDetails(req: Request, res: Response): Promise<void>
    createClient(req: Request, res: Response): Promise<void>
    getAllClients(req: Request, res: Response): Promise<void>
    getAllPlans(req: Request, res: Response): Promise<void>
    getClient(req: Request, res: Response): Promise<void>
    uploadContent(req: Request, res: Response): Promise<void>
    handleSendMail(req: Request, res: Response): Promise<void>
    getAvailableUsers(req: Request, res: Response): Promise<void>
    getProjects(req: Request, res: Response): Promise<void>
    editProjectStatus(req: Request, res: Response): Promise<void>
    getInitialSetUp(req: Request, res: Response): Promise<void>
    IntegratePaymentGateWay(req: Request, res: Response): Promise<void>
    getPaymentIntegrationStatus(req: Request, res: Response): Promise<void>
    createInvoice(req: Request, res: Response): Promise<void>
    upgradePlan(req: Request, res: Response): Promise<void>

}
