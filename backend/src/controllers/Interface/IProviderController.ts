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
    rescheduleContent(req: Request, res: Response): Promise<void>;
    
    getContentDetails(req: Request, res: Response): Promise<void>
    replayToComments(req: Request, res: Response): Promise<void>
    deleteComment(req: Request, res: Response): Promise<void>
    hideComment(req: Request, res: Response): Promise<void>
    saveContent(req:Request,res:Response):Promise<void>
    fetchContents(req:Request,res:Response):Promise<void>
    handleLinkedinCallback(req:Request,res:Response):Promise<void>
    handleXCallback(req:Request,res:Response):Promise<void>
    handleGmailCallback(req:Request,res:Response):Promise<void>
    fetchAllScheduledContents(req:Request,res:Response):Promise<void>
    getConnections(req:Request,res:Response):Promise<void>

}
