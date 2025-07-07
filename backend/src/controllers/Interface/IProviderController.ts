import { 
    Request, 
    Response 
} from 'express';

export interface IProviderController {
    processContentApproval(req: Request, res: Response): Promise<void>
    processContentReject(req: Request, res: Response): Promise<void>
    saveSocialPlatformToken(req:Request,res:Response):Promise<void>
    connectSocialPlatforms(req: Request, res: Response): Promise<void>;
    getMetaPagesDetails(req: Request, res: Response): Promise<void>;
    reScheduleContent(req: Request, res: Response): Promise<void>;
}
